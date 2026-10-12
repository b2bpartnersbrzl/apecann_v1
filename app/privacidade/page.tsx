import type { Metadata } from "next";
import { sitePath } from "../../lib/site-path";

export const metadata: Metadata = {
  title: "Política de privacidade | APECANN",
  description: "Informações sobre privacidade, contato e direitos relacionados aos dados pessoais no site da APECANN.",
};

export default function PrivacyPage() {
  return (
    <>
      <a className="skip-link" href="#politica">Ir para o conteúdo</a>
      <header className="site-header privacy-header">
        <a href={sitePath("/#inicio")} aria-label="APECANN, início"><img className="logo menu-logo" src={sitePath("/apecann-logo-lateral.svg")} alt="APECANN" width="641" height="136" /></a>
      </header>
      <main className="privacy-page" id="politica">
        <p className="eyebrow">Transparência e responsabilidade</p>
        <h1>Política de<br /><mark>privacidade.</mark></h1>
        <p className="privacy-updated">Atualizada em 12 de outubro de 2026.</p>
        <p className="privacy-intro">Esta política explica o tratamento de dados pessoais relacionado ao site e ao contato institucional com a APECANN. Ela abrange informações de contato e interesse, sem tratar de prontuários, consultas ou participação em pesquisas.</p>

        <section aria-labelledby="privacy-controller">
          <h2 id="privacy-controller">Quem é responsável pelos dados</h2>
          <p>A responsável é a Associação Pernambucana de Estudos e Desenvolvimento de Produtos Medicinais de Cannabis, APECANN, inscrita no CNPJ sob o nº <strong>63.637.531/0001-00</strong>, com endereço na Rua Noruega, 523, Loja 07, Imbiribeira, Recife, PE, CEP 51180-310.</p>
          <p>Para dúvidas sobre privacidade ou solicitações relacionadas aos seus dados, entre em contato pelo e-mail <a href="mailto:apecannbr@gmail.com">apecannbr@gmail.com</a>.</p>
        </section>

        <section aria-labelledby="privacy-information">
          <h2 id="privacy-information">Quais informações estão envolvidas</h2>
          <p>Os campos de interesse apresentados no site são nome, e-mail, celular, perfil de interesse, canais de contato escolhidos e autorização para receber comunicações. O celular é necessário apenas quando o canal escolhido inclui WhatsApp.</p>
          <p>Ao enviar o formulário e autorizar o contato, essas informações são registradas em uma planilha privada da APECANN. Também registramos a data e a hora do envio, os canais escolhidos, o texto e a versão da autorização, a versão da política de privacidade e um identificador do cadastro.</p>
          <p>Se você escrever para nosso e-mail, a associação poderá receber seu endereço eletrônico, nome e o conteúdo que você decidir enviar. Essas informações se destinam ao atendimento da sua solicitação.</p>
          <p>Não solicitamos diagnósticos, receitas, laudos ou outros dados de saúde neste formulário. Evite enviar essas informações por este canal de interesse institucional.</p>
        </section>

        <section aria-labelledby="privacy-purpose">
          <h2 id="privacy-purpose">Finalidade e autorização de contato</h2>
          <p>O cadastro de interesse tem como finalidade registrar sua aproximação com a associação e permitir o contato institucional sobre pesquisa, atividades e iniciativas da APECANN.</p>
          <p>O recebimento dessas comunicações depende da sua autorização, com base no consentimento, e dos canais escolhidos: e-mail e/ou WhatsApp. O registro não gera envio automático de mensagens pelo WhatsApp.</p>
          <p>Você pode deixar de autorizar as comunicações e continuar navegando pelo site. A autorização para novidades não representa adesão à associação, consulta, prescrição, participação em pesquisa ou acesso a produtos.</p>
        </section>

        <section aria-labelledby="privacy-providers">
          <h2 id="privacy-providers">Serviços utilizados e conservação</h2>
          <p>O canal de contato informado utiliza o Gmail, serviço do Google. As mensagens enviadas a esse endereço são processadas pelo provedor de e-mail, conforme a <a href="https://policies.google.com/privacy?hl=pt-BR">Política de Privacidade do Google</a>.</p>
          <p>O formulário utiliza Google Sheets para armazenar os cadastros e Google Apps Script para processar o registro e enviar um aviso à equipe responsável. O aviso contém um resumo do interesse e um link para consulta. A planilha tem acesso restrito às contas autorizadas pela APECANN, sem consulta pública por link. Esses serviços são fornecidos pelo Google e estão sujeitos à sua política de privacidade.</p>
          <p>Os dados do cadastro são conservados enquanto necessários ao relacionamento institucional autorizado. Você pode solicitar a revogação da autorização, o encerramento das comunicações e a exclusão dos seus dados pelo canal de privacidade. Eventual conservação nas hipóteses permitidas pela legislação deverá ser informada no atendimento da solicitação.</p>
          <p>Para mensagens recebidas por e-mail, você pode solicitar informações sobre a conservação e a exclusão dos seus dados pelo canal de privacidade. Eventual necessidade de conservação por obrigação legal deverá ser informada na resposta à solicitação.</p>
        </section>

        <section aria-labelledby="privacy-navigation">
          <h2 id="privacy-navigation">Cookies e navegação</h2>
          <p>Esta versão do site não utiliza cookies de publicidade, pixels de rastreamento ou ferramentas de análise de audiência. Não há criação de conta nem armazenamento de cadastros no navegador.</p>
          <p>O serviço do formulário utiliza identificadores temporários e uma representação criptográfica do e-mail para limitar tentativas excessivas de envio. Esse controle dura até dez minutos, não acrescenta o endereço IP à planilha e não cria um perfil de publicidade.</p>
          <p>O site é hospedado no GitHub Pages. O provedor pode processar registros técnicos de acesso para operação e segurança do serviço, conforme a <a href="https://docs.github.com/pt/site-policy/privacy-policies/github-general-privacy-statement">Política de Privacidade do GitHub</a>.</p>
        </section>

        <section aria-labelledby="privacy-rights">
          <h2 id="privacy-rights">Seus direitos</h2>
          <p>Nos termos da Lei Geral de Proteção de Dados Pessoais, você pode solicitar, conforme aplicável:</p>
          <ul>
            <li>Confirmação do tratamento e acesso aos seus dados.</li>
            <li>Correção de informações incompletas, incorretas ou desatualizadas.</li>
            <li>Informações sobre finalidade, conservação e compartilhamento.</li>
            <li>Anonimização, bloqueio ou exclusão nas hipóteses previstas em lei.</li>
            <li>Portabilidade, conforme a regulamentação aplicável.</li>
            <li>Revogação do consentimento e cancelamento das comunicações.</li>
          </ul>
          <p>Envie sua solicitação para <a href="mailto:apecannbr@gmail.com">apecannbr@gmail.com</a>. O exercício dos direitos é gratuito. Pode ser necessária a confirmação da sua identidade, limitada às informações pertinentes ao pedido.</p>
          <p>Você também pode buscar orientações e apresentar petição à <a href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares">Agência Nacional de Proteção de Dados, ANPD</a>, nos casos aplicáveis.</p>
        </section>

        <section aria-labelledby="privacy-updates">
          <h2 id="privacy-updates">Atualizações desta política</h2>
          <p>Esta política será atualizada quando houver mudanças nos canais, nas ferramentas ou no tratamento de dados. A data da versão ficará indicada no início da página. Novas finalidades que dependam de consentimento exigirão autorização específica.</p>
          <p>Referência: <a href="https://presidencia.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm">Lei nº 13.709/2018, LGPD</a>.</p>
        </section>
      </main>
      <footer className="site-footer privacy-footer"><div className="footer-brand"><img className="logo" src={sitePath("/apecann-logo-lateral.svg")} alt="APECANN" width="641" height="136" /><p>Ciência que muda o olhar.</p></div><a className="footer-follow" href="https://www.instagram.com/apecannoficial/" target="_blank" rel="noopener noreferrer" aria-label="Siga a APECANN no Instagram, abre em nova aba"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span><strong>Siga a APECANN</strong><span className="footer-follow-handle">@apecannoficial</span></span></a><div className="footer-links"><a href="mailto:apecannbr@gmail.com">apecannbr@gmail.com</a></div></footer>
    </>
  );
}
