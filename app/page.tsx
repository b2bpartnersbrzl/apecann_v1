"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONSENT_TEXT, validateCadastro } from "../lib/cadastro";
import { enviarCadastro } from "../lib/envio-cadastro";
import { sitePath } from "../lib/site-path";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactChannels, setContactChannels] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [registered, setRegistered] = useState(false);
  const requestId = useRef<string | null>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const phoneRequired = contactChannels.includes("WhatsApp");

  useEffect(() => {
    if (registered && confirmation.current) {
      confirmation.current.focus({preventScroll:true});
      confirmation.current.scrollIntoView({block:'start',behavior:'smooth'});
    }
  }, [registered]);

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSending) return;
    if (!contactChannels.length) { setFormError("Escolha pelo menos um canal de contato."); return; }
    const fields = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    setFormError("");
    setIsSending(true);
    try {
      const validation = validateCadastro({requestId:requestId.current,name:fields.get('name'),email:fields.get('email'),phone:fields.get('phone'),interest:fields.get('interest'),channels:contactChannels,consent:fields.get('consent')==='on',website:fields.get('website')});
      if ('error' in validation) { setFormError(validation.error); return; }
      const result = await enviarCadastro(validation.data);
      if (result.ok !== true || result.requestId !== requestId.current) {
        setFormError('Não foi possível confirmar seu cadastro. Tente novamente.');
        return;
      }
      setRegistered(true);
    } catch { setFormError('Não foi possível confirmar seu cadastro. Verifique sua conexão e tente novamente.'); }
    finally { setIsSending(false); }
  }

  function toggleChannel(channel: string) {
    setContactChannels((selected) => selected.includes(channel) ? selected.filter((item) => item !== channel) : [...selected, channel]);
    setFormError("");
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <div className="site-stage">
      <header className="site-header">
        <a href="#inicio" aria-label="APECANN, início"><img className="logo menu-logo" src={sitePath("/apecann-logo-lateral.svg")} alt="APECANN" width="641" height="136" /></a>
        <button className="menu-toggle" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></button>
        <nav id="navigation" aria-label="Navegação principal" className={menuOpen ? "is-open" : ""} onClick={() => setMenuOpen(false)}>
          <a href="#proposito">Nosso propósito</a>
          <a href="#desenvolvimento">O que nos orienta</a>
          <a href="#pessoas">Bem-estar humano</a>
          <a href="#animais">Bem-estar animal</a>
          <a className="button small" href="#interesse">Quero acompanhar</a>
        </nav>
      </header>
      <main id="conteudo">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Pesquisa e desenvolvimento em cannabis medicinal</p>
            <h1 id="hero-title"><mark>Ciência que</mark><br /><mark>muda o olhar.</mark></h1>
            <p className="hero-description">Desenvolver possibilidades de tratamento. Com um propósito: o bem-estar de pessoas e animais.</p>
            <a className="button" href="#interesse">Quero acompanhar a APECANN</a>
          </div>
          <figure className="hero-photo">
            <img src={sitePath("/images/casal-pet-horizontal.webp")} alt="Casal jovem em um passeio ao ar livre, com um cachorro no colo da mulher." width="1902" height="827" fetchPriority="high" />
          </figure>
        </section>
        <section className="purpose section-space" id="proposito" aria-labelledby="purpose-title">
          <figure className="purpose-photo"><picture><source media="(orientation: portrait) and (max-width: 700px)" srcSet={sitePath("/images/largo-vertical.webp")} /><img src={sitePath("/images/largo-horizontal.webp")} alt="Pessoas caminhando em diferentes direções por um largo, com cães acompanhando seus tutores." width="1903" height="826" loading="lazy" /></picture></figure>
          <div className="purpose-content">
          <p className="eyebrow">Nosso propósito</p>
          <div className="purpose-columns">
            <h2 id="purpose-title">Desenvolvimento<br />científico.<br /><mark>Dimensão social.</mark></h2>
            <div className="prose">
              <p>A APECANN é uma associação sem fins lucrativos dedicada ao estudo e ao desenvolvimento de produtos medicinais de cannabis.</p>
              <p>Nossa pesquisa reúne responsabilidade técnica e atenção às necessidades de pessoas e animais. É essa relação que dá dimensão social ao desenvolvimento científico.</p>
            </div>
          </div>
          </div>
        </section>
        <section className="development" id="desenvolvimento" aria-labelledby="development-title">
          <figure className="lab-photo">
            <img src={sitePath("/images/laboratorio-horizontal.webp")} alt="Representação ilustrativa de um rotaevaporador em ambiente de laboratório." width="1902" height="827" loading="lazy" />
          </figure>
          <div className="development-copy">
            <p className="eyebrow">O que nos orienta</p>
            <h2 id="development-title">Desenvolver.<br /><mark>Com propósito.</mark></h2>
            <div className="principle"><h3>Necessidades individuais.</h3><p>A pesquisa de formulações parte de necessidades específicas. A avaliação e a prescrição profissional orientam cada tratamento.</p></div>
            <div className="principle"><h3>Conhecimento que acompanha.</h3><p>Orientação farmacêutica, controle de qualidade e rastreabilidade são princípios que orientam nossa pesquisa e o desenvolvimento de formulações.</p></div>
            <div className="principle"><h3>O bem-estar é a direção.</h3><p>Pessoas e animais têm necessidades próprias. Cada contexto exige conhecimento e acompanhamento profissional, médico ou veterinário.</p></div>
          </div>
        </section>
        <section className="human-story" id="pessoas" aria-labelledby="human-title">
          <figure className="human-photo"><img src={sitePath("/images/familia-geracoes-horizontal.webp")} alt="Jovens, adultos e idosos convivendo em uma varanda, com um cachorro junto à jovem da família." width="1902" height="827" loading="lazy" /></figure>
          <div className="human-copy">
            <p className="eyebrow">Bem-estar humano</p>
            <h2 id="human-title">Cada pessoa<br /><mark>move nossa</mark><br /><mark>pesquisa.</mark></h2>
            <p>Olhar para as necessidades de cada pessoa orienta o estudo e o desenvolvimento de possibilidades de tratamento na APECANN. A individualização e a importância do acompanhamento farmacêutico orientam essa investigação.</p>
          </div>
        </section>
        <section className="pet-story" id="animais" aria-labelledby="pet-title">
          <figure className="pet-photo"><picture><source media="(orientation: portrait) and (max-width: 700px)" srcSet={sitePath("/images/cachorro-gato-horizontal.webp")} /><img src={sitePath("/images/cachorro-gato-horizontal-estendido.webp")} alt="Cachorro caramelo e branco e gato cinza descansando juntos no tapete, ao lado de sua tutora." width="1902" height="827" loading="lazy" /></picture></figure>
          <div className="pet-copy"><p className="eyebrow">Bem-estar animal</p><h2 id="pet-title">Eles também<br /><mark>movem nossa</mark><br /><mark>pesquisa.</mark></h2><p>O bem-estar dos animais faz parte do propósito da APECANN. Investigar possibilidades para eles exige atenção às suas necessidades e às particularidades de cada espécie.</p><p className="pet-note">A avaliação e a prescrição veterinária orientam o cuidado com cada animal.</p></div>
        </section>
        <section className="interest section-space" id="interesse" aria-labelledby="interest-title">
          <div className="interest-copy">
            <p className="eyebrow">Acompanhe nossa pesquisa</p>
            <h2 id="interest-title">O próximo passo<br />começa com uma<br /><mark>conexão.</mark></h2>
            <p>Acompanhe a pesquisa da APECANN e conheça nossas atividades, iniciativas e avanços no desenvolvimento de possibilidades de tratamento.</p>
            <p className="secondary">O registro de interesse não representa adesão, consulta ou disponibilização de produtos.</p>
          </div>
          <div className="form-area">
            {registered ? <div className="form-confirmation" tabIndex={-1} ref={confirmation} role="status"><h3>Você agora acompanha a APECANN.</h3><p>Seu interesse foi registrado. As novidades sobre nossa pesquisa, atividades e iniciativas chegarão pelos canais que você escolheu.</p><a className="footer-follow confirmation-follow" href="https://www.instagram.com/apecannoficial/" target="_blank" rel="noopener noreferrer" aria-label="Siga também a APECANN no Instagram, abre em nova aba"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span><strong>Siga também a APECANN</strong><span className="footer-follow-handle">@apecannoficial</span></span></a></div> : <><h3>Quero acompanhar a APECANN</h3>
              <form onSubmit={submitInterest} aria-busy={isSending}>
                <fieldset className="form-fields" disabled={isSending}>
                <div className="form-trap" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
                <label htmlFor="name">Nome</label><input id="name" name="name" autoComplete="off" required placeholder="Como podemos chamar você?" />
                <label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="off" required placeholder="voce@exemplo.com" />
                <label htmlFor="phone">Celular <span>({phoneRequired ? "para WhatsApp" : "opcional"})</span></label><input id="phone" name="phone" type="tel" autoComplete="off" required={phoneRequired} placeholder="DDD e número" />
                <label htmlFor="interest">O que aproxima você da APECANN?</label>
                <select id="interest" name="interest" required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Informações para mim</option><option>Informações para outra pessoa</option><option>Informações para meu animal</option><option>Sou profissional de saúde</option><option>Sou médico-veterinário</option><option>Quero conhecer a associação</option></select>
                <fieldset className="contact-channels" aria-describedby="channels-help">
                  <legend>Por onde você quer receber novidades?</legend>
                  <p id="channels-help" className="field-help">Escolha um ou mais canais.</p>
                  <div className="channel-options">
                    {["E-mail", "WhatsApp"].map((channel) => <label className="check-option" key={channel}><input type="checkbox" name="channels" value={channel} checked={contactChannels.includes(channel)} onChange={() => toggleChannel(channel)} /><span>{channel}</span></label>)}
                  </div>
                </fieldset>
                <label className="check-option consent-option" htmlFor="consent"><input id="consent" name="consent" type="checkbox" required aria-describedby="consent-help" /><span>{CONSENT_TEXT}</span></label>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <button className="button" type="submit">{isSending ? 'Enviando…' : formError ? 'Tentar novamente' : 'Cadastrar'}</button>
                <p id="consent-help" className="field-help">Você pode revogar esta autorização e cancelar o recebimento de mensagens a qualquer momento.</p>
                <a className="privacy-form-link" href={sitePath("/privacidade")}><span aria-hidden="true">▸ </span>Leia a Política de Privacidade</a>
                <details className="data-use"><summary>Entenda como seus dados serão utilizados</summary><p>Nome, e-mail, celular, perfil de interesse e canais escolhidos serão utilizados para registrar seu interesse e direcionar as comunicações da APECANN. O contato por WhatsApp depende do número informado e da sua escolha desse canal.</p></details>
                </fieldset>
              </form>
              </>}
          </div>
        </section>
      </main>
      </div>
      <footer className="site-footer"><div className="footer-brand"><img className="logo" src={sitePath("/apecann-logo-lateral.svg")} alt="APECANN" width="641" height="136" /><p>Ciência que muda o olhar.</p></div><a className="footer-follow" href="https://www.instagram.com/apecannoficial/" target="_blank" rel="noopener noreferrer" aria-label="Siga a APECANN no Instagram, abre em nova aba"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span><strong>Siga a APECANN</strong><span className="footer-follow-handle">@apecannoficial</span></span></a><div className="footer-information"><p>Associação sem fins lucrativos.<br />Pesquisa e desenvolvimento em cannabis medicinal.</p><div className="footer-links"><a href={sitePath("/privacidade")}>Política de Privacidade</a></div></div></footer>
    </>
  );
}
