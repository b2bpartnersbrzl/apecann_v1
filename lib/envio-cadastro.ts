import type { Cadastro } from './cadastro';

const endpoint = 'https://script.google.com/macros/s/AKfycbxy0qWRdXwpnIsnMTujccntlTxMjL7_9ZD2elxRLPcHGcebKmRlELeZLmOSUww-DoCg/exec';

export function enviarCadastro(payload: Cadastro): Promise<{ok: boolean; requestId?: string}> {
  return new Promise((resolve, reject) => {
    const bridgeId = crypto.randomUUID();
    const frame = document.createElement('iframe');
    frame.title = 'Envio seguro do cadastro APECANN';
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
    frame.tabIndex = -1;
    const url = new URL(endpoint);
    url.searchParams.set('parentOrigin', window.location.origin);
    url.searchParams.set('bridgeId', bridgeId);
    frame.src = url.toString();
    let sender: MessageEventSource | null = null;
    const cleanup = () => { clearTimeout(timeout); window.removeEventListener('message', receive); frame.remove(); };
    const timeout = setTimeout(() => { cleanup(); reject(new Error('Não foi possível confirmar o cadastro. Tente novamente.')); }, 60_000);
    function receive(event: MessageEvent) {
      let origin: URL;
      try { origin = new URL(event.origin); } catch { return; }
      if (origin.protocol !== 'https:' || !(origin.hostname === 'script.google.com' || origin.hostname === 'script.googleusercontent.com' || origin.hostname.endsWith('-script.googleusercontent.com'))) return;
      const message = event.data;
      if (!message || message.bridgeId !== bridgeId) return;
      if (message.type === 'apecann-ready' && event.source && !sender) {
        sender = event.source;
        (sender as Window).postMessage({type:'apecann-submit', bridgeId, payload}, event.origin);
      } else if (message.type === 'apecann-result' && sender === event.source) {
        cleanup();
        resolve({ok:message.ok === true && message.requestId === payload.requestId, requestId:message.requestId});
      }
    }
    window.addEventListener('message', receive);
    document.body.append(frame);
  });
}
