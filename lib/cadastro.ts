export const CONSENT_VERSION = '2026-10-12';
export const CONSENT_TEXT = 'Autorizo a APECANN a coletar e utilizar os dados que informei para registrar meu interesse e enviar novidades institucionais pelos canais que eu escolher: e-mail e/ou WhatsApp.';
export const INTEREST_OPTIONS = ['Informações para mim', 'Informações para outra pessoa', 'Informações para meu animal', 'Sou profissional de saúde', 'Sou médico-veterinário', 'Quero conhecer a associação'];

export type Cadastro = {
  requestId: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  channels: string[];
  consent: boolean;
  website?: string;
};

export function validateCadastro(value: unknown): {data: Cadastro} | {error: string} {
  if (!value || typeof value !== 'object') return {error: 'Revise os dados do formulário.'};
  const input = value as Record<string, unknown>;
  const text = (key: string) => typeof input[key] === 'string' ? (input[key] as string).trim() : '';
  const requestId = text('requestId');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return {error:'Não foi possível identificar este envio. Atualize a página e tente novamente.'};
  const name = text('name');
  const email = text('email').toLowerCase();
  const phone = text('phone').replace(/\D/g, '');
  const interest = text('interest');
  const channels = Array.isArray(input.channels) ? [...new Set(input.channels)] : [];
  if (text('website')) return {error:'Não foi possível registrar seu interesse.'};
  if (name.length < 2 || name.length > 120 || /[\r\n]/.test(name)) return {error:'Informe seu nome, com até 120 caracteres.'};
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {error:'Informe um e-mail válido.'};
  if (!INTEREST_OPTIONS.includes(interest)) return {error:'Selecione seu perfil de interesse.'};
  if (!channels.length || channels.some(channel => channel !== 'E-mail' && channel !== 'WhatsApp')) return {error:'Escolha pelo menos um canal de contato.'};
  if ((phone && (phone.length < 10 || phone.length > 15)) || (channels.includes('WhatsApp') && !phone)) return {error:'Informe um celular válido para receber contato por WhatsApp.'};
  if (input.consent !== true) return {error:'Autorize o uso dos dados para registrar seu interesse.'};
  return {data:{requestId,name,email,phone,interest,channels:channels as string[],consent:true}};
}
