import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';

function moduleFrom(file,extras={}) {
  const module={exports:{}};
  const code=ts.transpileModule(fs.readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(code,{module,exports:module.exports,...extras});
  return module.exports;
}
const validation=moduleFrom('../lib/cadastro.ts');
const data={requestId:'626015ce-cb38-4913-96e7-65de14932114',name:'Cadastro fictício',email:'teste@example.invalid',phone:'',interest:'Informações para meu animal',channels:['E-mail'],consent:true};
const payload={...data,token:'somente-teste',consentText:validation.CONSENT_TEXT,consentVersion:validation.CONSENT_VERSION,privacyVersion:validation.CONSENT_VERSION,source:'site'};

test('consentimento, canal e celular para WhatsApp são validados',()=>{
  assert.ok(validation.validateCadastro(data).data);
  for(const value of [{...data,consent:false},{...data,channels:[]},{...data,channels:['WhatsApp']},{...data,channels:['SMS']},{...data,website:'bot'}]) assert.ok(validation.validateCadastro(value).error);
});

function google({mailFails=false,storageFails=false}={}) {
  const cache=new Map();
  const rows=[['ID','Data do cadastro','Nome','E-mail','Celular','Perfil de interesse','E-mail autorizado','WhatsApp autorizado','Consentimento','Versão do consentimento','Política de privacidade','Origem','Notificação','Notificada em']];
  const mails=[];
  const sheet={getLastRow:()=>rows.length,getSheetId:()=>123,getRange:(r,c,n=1,w=1)=>({
    getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:w},(_,j)=>rows[r-1+i]?.[c-1+j]??'')),
    setValues:values=>{if(storageFails)throw Error('storage');values.forEach((row,i)=>{rows[r-1+i]??=Array(14).fill('');row.forEach((v,j)=>rows[r-1+i][c-1+j]=v);});},
    setNumberFormat:()=>{},setValue:v=>{rows[r-1][c-1]=v;},
    createTextFinder:text=>({matchEntireCell:()=>({findNext:()=>{const index=rows.findIndex((row,i)=>i>0&&row[0]===text);return index<0?null:{getRow:()=>index+1};}})})
  })};
  const file={getSheetByName:()=>sheet,getUrl:()=>'https://docs.google.com/spreadsheets/d/TESTE/edit'};
  const ctx=vm.createContext({CacheService:{getScriptCache:()=>({get:k=>cache.get(k)??null,put:(k,v)=>cache.set(k,v)})},Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,text)=>crypto.createHash('sha256').update(text).digest(),base64EncodeWebSafe:bytes=>Buffer.from(bytes).toString('base64url')},HtmlService:{XFrameOptionsMode:{ALLOWALL:'allow'},createHtmlOutput:html=>({setXFrameOptionsMode:()=>html})},SpreadsheetApp:{openById:()=>file,flush:()=>{}},PropertiesService:{getScriptProperties:()=>({getProperty:key=>({CADASTROS_TOKEN:'somente-teste',SPREADSHEET_ID:'TESTE',NOTIFY_EMAIL:'apecannbr@gmail.com'})[key]})},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})},MailApp:{sendEmail:mail=>{if(mailFails)throw Error('mail');mails.push(mail);}},ContentService:{MimeType:{JSON:'json'},createTextOutput:body=>({setMimeType:()=>({getContent:()=>body})})}});
  vm.runInContext(fs.readFileSync(new URL('../integrations/google/Code.gs',import.meta.url),'utf8'),ctx);
  return {rows,mails,cache,ctx,send:value=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(value)}}).getContent())};
}

test('ponte pública guarda a chave no Google e exige sessão válida',()=>{
  const flow=google();
  const html=flow.ctx.doGet({parameter:{parentOrigin:'https://apecann.com.br',bridgeId:crypto.randomUUID()}});
  assert.ok(!html.includes('somente-teste'));
  assert.ok(html.includes('google.script.run'));
  const nonce=[...flow.cache.keys()][0].slice(4);
  assert.equal(flow.ctx.registrarInteresse(data,'invalido').ok,false);
  assert.equal(flow.ctx.registrarInteresse({...data,website:'bot'},nonce).ok,false);
  assert.equal(flow.ctx.registrarInteresse({...data,consent:false},nonce).ok,false);
  assert.equal(flow.rows.length,1);
  assert.equal(flow.ctx.registrarInteresse(data,nonce).ok,true);
  assert.equal(flow.ctx.registrarInteresse(data,nonce).ok,true);
  assert.equal(flow.rows.length,2);
  assert.equal(flow.mails.length,1);
});

test('salva antes de notificar e uma repetição não duplica cadastro ou aviso',()=>{
  const flow=google();
  assert.equal(flow.send(payload).ok,true);
  assert.equal(flow.rows.length,2);
  assert.equal(flow.rows[1][12],'Enviada');
  assert.equal(flow.mails.length,1);
  assert.equal(flow.mails[0].to,'apecannbr@gmail.com');
  assert.equal(flow.mails[0].cc,'apecannoficial@gmail.com');
  assert.match(flow.mails[0].body,/Canais autorizados: E-mail/);
  assert.equal(flow.send(payload).ok,true);
  assert.equal(flow.rows.length,2);
  assert.equal(flow.mails.length,1);
  assert.equal(flow.send({...payload,name:'Outro nome'}).ok,false);
});

test('falha do e-mail mantém cadastro salvo e identificável para reenvio',()=>{
  const flow=google({mailFails:true});
  assert.equal(flow.send(payload).ok,true);
  assert.equal(flow.rows.length,2);
  assert.equal(flow.rows[1][12],'Falha no aviso');
});

test('falha de armazenamento não confirma nem envia aviso',()=>{
  const flow=google({storageFails:true});
  assert.equal(flow.send(payload).ok,false);
  assert.equal(flow.mails.length,0);
});

test('chave incorreta é recusada e texto com fórmula é guardado como literal',()=>{
  const flow=google();
  assert.equal(flow.send({...payload,token:'errado'}).ok,false);
  assert.equal(flow.rows.length,1);
  assert.equal(flow.send({...payload,name:'=HYPERLINK("url")'}).ok,true);
  assert.ok(flow.rows[1][2].startsWith("'="));
});
