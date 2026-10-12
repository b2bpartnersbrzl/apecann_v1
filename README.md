# APECANN

Site institucional com pesquisa, propósito social, bem-estar humano e animal, política de privacidade e cadastro de interesse integrado ao Google.

**Página pública:** https://apecann.com.br/

## Executar localmente

Instale as dependências com `npm install`. Execute `npm run dev` e abra http://localhost:3000. A integração de cadastro aceita a prévia na porta 3107: use `npm run dev -- --port 3107` para validar o envio ao Google.

O GitHub Pages publica os arquivos da raiz de `gh-pages`. O código editável está em `main`. O cadastro é processado no Google Apps Script e armazenado em planilha privada, sem servidor Next.js em produção.

## Preparar a publicação

Execute `node scripts/preparar-pages.mjs CAMINHO_DA_PASTA_DE_TRABALHO` em uma pasta nova fora do repositório. O processo gera os arquivos em `out`, preserva o domínio `apecann.com.br`, fontes e prévia de compartilhamento. Não copia arquivos `.env` nem credenciais. Publique somente o conteúdo de `out` na raiz de `gh-pages`, preservando seu histórico.

`node --test tests/cadastros.test.mjs` verifica o fluxo com dados simulados, sem enviar e-mails. Valide no navegador com cadastro fictício autorizado e remova somente as linhas de teste.

## Documentação

- [Infraestrutura digital](docs/infraestrutura-digital.md)
- [Cadastro, planilha e notificações](integrations/google/README.md)
