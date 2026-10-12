/** APECANN: planilha privada, registro de consentimento e aviso de cadastro. */
const HEADERS = ['ID','Data do cadastro','Nome','E-mail','Celular','Perfil de interesse','E-mail autorizado','WhatsApp autorizado','Consentimento','Versão do consentimento','Política de privacidade','Origem','Notificação','Notificada em'];
const PROFILES = ['Informações para mim','Informações para outra pessoa','Informações para meu animal','Sou profissional de saúde','Sou médico-veterinário','Quero conhecer a associação'];

function prepararFluxo_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();
  props.setProperty('SPREADSHEET_ID',sheet.getId());
  if (!props.getProperty('CADASTROS_TOKEN')) props.setProperty('CADASTROS_TOKEN',Utilities.getUuid()+Utilities.getUuid());
  props.setProperty('NOTIFY_EMAIL','apecannbr@gmail.com');
  const tab = sheet.getSheetByName('Cadastros');
  if (!tab || JSON.stringify(tab.getRange(1,1,1,14).getValues()[0]) !== JSON.stringify(HEADERS)) throw new Error('Cabeçalhos da planilha não correspondem ao fluxo.');
  tab.setFrozenRows(1);
  tab.getRange(1,1,1,14).setBackground('#eeeeee').setFontWeight('bold').setWrap(true);
  tab.setRowHeight(1,40);
  if (!tab.getFilter()) tab.getRange(1,1,tab.getMaxRows(),14).createFilter();
  sheet.setSpreadsheetTimeZone('America/Sao_Paulo');
  sheet.setSpreadsheetLocale('pt_BR');
}

// Public browser bridge. It never returns the spreadsheet or the private key.
function doGet(event) {
  const origin = event && event.parameter && event.parameter.parentOrigin;
  const bridgeId = event && event.parameter && event.parameter.bridgeId;
  const allowed = ['https://apecann.com.br','https://b2bpartnersbrzl.github.io','http://localhost:3107','http://127.0.0.1:3107'];
  if (!allowed.includes(origin) || !/^[0-9a-f-]{36}$/i.test(bridgeId || '')) return HtmlService.createHtmlOutput('APECANN');
  const nonce = Utilities.getUuid();
  CacheService.getScriptCache().put('web:'+nonce,'0',600);
  const config = JSON.stringify({origin,bridgeId,nonce});
  return HtmlService.createHtmlOutput('<!doctype html><html><head><meta charset="utf-8"></head><body><script>'+
    'const config='+config+';let sending=false;'+
    'function reply(value){window.top.postMessage({type:"apecann-result",bridgeId:config.bridgeId,...value},config.origin);}'+
    'window.addEventListener("message",function(event){'+
      'if(event.source!==window.top||event.origin!==config.origin||!event.data||event.data.type!=="apecann-submit"||event.data.bridgeId!==config.bridgeId||sending)return;'+
      'sending=true;google.script.run.withSuccessHandler(function(result){reply(result);}).withFailureHandler(function(){reply({ok:false});}).registrarInteresse(event.data.payload,config.nonce);'+
    '});window.top.postMessage({type:"apecann-ready",bridgeId:config.bridgeId},config.origin);'+
    '</script></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function registrarInteresse(input,nonce) {
  if (!input || typeof input !== 'object' || input.website || JSON.stringify(input).length > 8192 || !/^[0-9a-f-]{36}$/i.test(nonce || '')) return {ok:false};
  const cache = CacheService.getScriptCache();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return {ok:false};
  try {
    const attempts = cache.get('web:'+nonce);
    if (attempts === null || Number(attempts) >= 5) return {ok:false};
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const key = 'mail:'+Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,email));
    const previous = Number(cache.get(key) || 0);
    if (previous >= 5) return {ok:false};
    cache.put('web:'+nonce,String(Number(attempts)+1),600);
    cache.put(key,String(previous+1),600);
  } finally { lock.releaseLock(); }
  const data = {...input,
    name:typeof input.name==='string'?input.name.trim():'',
    email:typeof input.email==='string'?input.email.trim().toLowerCase():'',
    phone:typeof input.phone==='string'?input.phone.replace(/\D/g,''):'',
    token:PropertiesService.getScriptProperties().getProperty('CADASTROS_TOKEN'),
    consentText:'Autorizo a APECANN a coletar e utilizar os dados que informei para registrar meu interesse e enviar novidades institucionais pelos canais que eu escolher: e-mail e/ou WhatsApp.',
    consentVersion:'2026-10-12',privacyVersion:'2026-10-12',source:'site'};
  return JSON.parse(doPost({postData:{contents:JSON.stringify(data)}}).getContent());
}

function doPost(event) {
  const props = PropertiesService.getScriptProperties();
  let data;
  try {
    if (!event || !event.postData || event.postData.contents.length > 8192) return json_({ok:false});
    data = JSON.parse(event.postData.contents);
    const token = props.getProperty('CADASTROS_TOKEN');
    if (!token || data.token !== token) return json_({ok:false});
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) return json_({ok:false});
    if (typeof data.name !== 'string' || data.name.length < 2 || data.name.length > 120 || /[\r\n]/.test(data.name)) return json_({ok:false});
    if (typeof data.email !== 'string' || data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return json_({ok:false});
    if (!PROFILES.includes(data.interest) || data.consent !== true || data.consentVersion !== '2026-10-12') return json_({ok:false});
    if (!Array.isArray(data.channels) || !data.channels.length || data.channels.some(c=>c!=='E-mail'&&c!=='WhatsApp')) return json_({ok:false});
    if (typeof data.phone !== 'string' || (data.phone && !/^\d{10,15}$/.test(data.phone)) || (data.channels.includes('WhatsApp') && !data.phone)) return json_({ok:false});
    const consentText = 'Autorizo a APECANN a coletar e utilizar os dados que informei para registrar meu interesse e enviar novidades institucionais pelos canais que eu escolher: e-mail e/ou WhatsApp.';
    if (data.consentText !== consentText || data.privacyVersion !== '2026-10-12' || data.source !== 'site') return json_({ok:false});
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return json_({ok:false});
    try {
      const file = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
      const sheet = file.getSheetByName('Cadastros');
      if (!sheet || JSON.stringify(sheet.getRange(1,1,1,14).getValues()[0]) !== JSON.stringify(HEADERS)) return json_({ok:false});
      const last = sheet.getLastRow();
      const found = last > 1 ? sheet.getRange(2,1,last-1,1).createTextFinder(data.requestId).matchEntireCell(true).findNext() : null;
      if (found) {
        const previous = sheet.getRange(found.getRow(),1,1,14).getValues()[0];
        const same = matches_(previous[2],data.name) && matches_(previous[3],data.email) && matches_(previous[4],data.phone) && previous[5]===data.interest && previous[6]===(data.channels.includes('E-mail')?'Sim':'Não') && previous[7]===(data.channels.includes('WhatsApp')?'Sim':'Não');
        return json_({ok:same,requestId:data.requestId});
      }
      const row = Math.max(last+1,2);
      const record = [data.requestId,new Date(),literal_(data.name),literal_(data.email),literal_(data.phone),data.interest,data.channels.includes('E-mail')?'Sim':'Não',data.channels.includes('WhatsApp')?'Sim':'Não',consentText,data.consentVersion,data.privacyVersion,'Site APECANN','Pendente',''];
      sheet.getRange(row,5).setNumberFormat('@');
      sheet.getRange(row,1,1,14).setValues([record]);
      sheet.getRange(row,2).setNumberFormat('dd/MM/yyyy HH:mm:ss');
      sheet.getRange(row,5).setNumberFormat('@');
      SpreadsheetApp.flush();
      // The registration remains saved even if MailApp is unavailable.
      notify_(file,sheet,row,record,props.getProperty('NOTIFY_EMAIL'));
      return json_({ok:true,requestId:data.requestId});
    } finally {lock.releaseLock();}
  } catch { return json_({ok:false}); }
}

function notify_(file,sheet,row,record,recipient) {
  try {
    if (recipient !== 'apecannbr@gmail.com') throw new Error('Destinatário não configurado.');
    const channels = [record[6]==='Sim'?'E-mail':'',record[7]==='Sim'?'WhatsApp':''].filter(Boolean).join(' e ');
    const link = file.getUrl()+'#gid='+sheet.getSheetId()+'&range=A'+row+':N'+row;
    const body = 'Novo cadastro de interesse na APECANN.\n\nNome: '+record[2]+'\nPerfil de interesse: '+record[5]+'\nCanais autorizados: '+channels+'\n\nConsulte os contatos e a autorização na planilha privada:\n'+link+'\n\nUtilize somente os canais escolhidos para o contato institucional.\n\nEdson';
    MailApp.sendEmail({to:recipient,cc:'apecannoficial@gmail.com',subject:'APECANN | Novo cadastro via site',body:body,name:'Edson | APECANN'});
    sheet.getRange(row,13,1,2).setValues([['Enviada',new Date()]]);
    sheet.getRange(row,14).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  } catch { sheet.getRange(row,13).setValue('Falha no aviso'); }
}

// Manual retry only: no recurring trigger is created.
function reenviarAvisosPendentes_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('Há um envio em andamento.');
  try {
    const props = PropertiesService.getScriptProperties();
    const file = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
    const sheet = file.getSheetByName('Cadastros');
    if (sheet.getLastRow()<2) return;
    const records = sheet.getRange(2,1,sheet.getLastRow()-1,14).getValues();
    records.forEach((record,index)=>{if (record[12]==='Pendente'||record[12]==='Falha no aviso') notify_(file,sheet,index+2,record,props.getProperty('NOTIFY_EMAIL'));});
  } finally {lock.releaseLock();}
}

function literal_(value) {return /^[=+\-@]/.test(value)?"'"+value:value;}
function matches_(stored,value) {return String(stored)===value || String(stored)===literal_(value);}
function json_(value) {return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
