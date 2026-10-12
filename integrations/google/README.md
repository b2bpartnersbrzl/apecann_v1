# Cadastros de interesse da APECANN

O site estático permanece no GitHub Pages. Após autorização do visitante, o formulário abre uma ponte invisível do Google Apps Script. A ponte recebe os campos, valida o cadastro e devolve a confirmação de gravação. Não depende de API Next.js nem de outra hospedagem.

A planilha pertence a `apecannoficial@gmail.com`. `apecannbr@gmail.com` tem acesso de leitura e recebe avisos, com cópia para `apecannoficial@gmail.com`. O aviso contém nome, perfil, canais autorizados e link para consulta da linha na planilha privada. Os contatos completos permanecem na planilha. O visitante recebe confirmação na página, sem e-mail automático de confirmação.

## Configuração e manutenção

- O projeto usa `Code.gs`, vinculado à planilha com a aba `Cadastros` e os 14 cabeçalhos previstos no código.
- As propriedades privadas são `SPREADSHEET_ID`, `NOTIFY_EMAIL` e `CADASTROS_TOKEN`. A chave permanece no Google, sem inclusão no navegador, arquivos públicos ou repositório.
- O aplicativo da Web executa como a conta oficial e aceita cadastros de visitantes anônimos. Planilha e projeto permanecem restritos. Atualizações usam uma nova versão da implantação existente, mantendo a URL em `lib/envio-cadastro.ts`.
- A ponte aceita a origem do GitHub e a prévia local na porta 3107. Mudanças de domínio exigem atualizar as origens, o prefixo de publicação e os metadados.
- Identificadores temporários e o hash do e-mail limitam a cinco tentativas em dez minutos. Isso reduz repetições, sem representar proteção completa contra abuso. Não são gravados IPs na planilha.
- Funções administrativas terminam em `_` e não ficam disponíveis em `google.script.run`. `reenviarAvisosPendentes_` serve ao reenvio manual. Não há acionadores recorrentes.

## Comportamento

- Durante o envio, o botão mostra `Enviando…` e os campos ficam desabilitados.
- O sucesso exige confirmação do Google com o mesmo identificador. Falhas preservam os campos para nova tentativa.
- A repetição do mesmo envio não duplica linha nem aviso. Dados diferentes com o mesmo identificador são recusados.
- A gravação ocorre antes do aviso. Uma falha de e-mail mantém o cadastro e registra `Falha no aviso`. `Enviada` indica que o serviço aceitou o envio, sem comprovar entrega na caixa de entrada.
- O registro inclui horário de Brasília, canais escolhidos, texto e versão do consentimento e versão da política. Texto digitado não pode virar fórmula.
- Não há prontuário, diagnóstico, adesão automática, disparo de novidades ou envio automático de WhatsApp.

## Verificação

`node --test tests/cadastros.test.mjs` usa dados simulados sem acessar o Google ou enviar e-mails. A exportação verifica compilação e tipos. O teste no navegador confere confirmação, linha salva e situação do aviso, com cadastro fictício autorizado e remoção exclusiva da linha de teste.

Não registrar dados reais, tokens ou conteúdo integral dos envios nos logs. Publicar apenas os arquivos exportados.
