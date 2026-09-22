# Infraestrutura digital da APECANN

Inventário verificado em 22 de setembro de 2026. Este documento registra apenas informações técnicas necessárias ao projeto. Credenciais, documentos, endereços, telefones e dados de pagamento não devem ser armazenados no repositório.

## GitHub

- Repositório: `https://github.com/b2bpartnersbrzl/apecann_v1`
- URL Git: `https://github.com/b2bpartnersbrzl/apecann_v1.git`
- Visibilidade: pública
- Branch principal: `main`

## Domínio

- Domínio principal: `apecann.com.br`
- Registrador e DNS autoritativo: Registro.br
- Status no painel: publicado
- Data de criação: 12 de maio de 2026
- Data de expiração: 12 de maio de 2030
- Servidores DNS: `a.auto.dns.br` e `b.auto.dns.br`
- Provedor de serviços no Registro.br: não selecionado

## Estado atual do DNS

- O domínio raiz não possui registro `A` ou `AAAA` para um site.
- `www.apecann.com.br` não possui apontamento.
- O domínio não possui servidor de e-mail. O registro `MX` é nulo, com prioridade 0 e destino `.`.
- O registro SPF atual é `v=spf1 -all`, que informa que nenhum servidor está autorizado a enviar e-mail pelo domínio.
- Não foi encontrado registro `CAA`.
- O modo básico do DNS do Registro.br está ativo e os campos de endereço do site e servidor de e-mail estão vazios.
- Uma tentativa de acesso a `https://apecann.com.br` falhou por ausência de resolução do domínio, comportamento coerente com a configuração atual.

## Renovação consultada no Registro.br

Valores exibidos em 22 de setembro de 2026:

| Período | Valor |
| --- | ---: |
| 1 ano | R$ 40,00 |
| 2 anos | R$ 76,00 |
| 3 anos | R$ 112,00 |
| 4 anos | R$ 148,00 |
| 5 anos | R$ 184,00 |
| 6 anos | R$ 220,00 |

Não há necessidade de renovação imediata, pois o domínio está pago até maio de 2030.

## Próximas decisões de infraestrutura

1. Definir a plataforma de hospedagem do site.
2. Publicar uma primeira versão de homologação antes de alterar o domínio principal.
3. Apontar o domínio raiz e o subdomínio `www` para a hospedagem escolhida.
4. Decidir se haverá e-mail profissional com endereços `@apecann.com.br`.
5. Se houver e-mail, configurar `MX`, SPF, DKIM e DMARC conforme o provedor escolhido.
6. Validar HTTPS, redirecionamento entre domínio raiz e `www`, além de monitoramento de disponibilidade.

## Recomendação

Manter o DNS no Registro.br até a plataforma de hospedagem ser definida. A ausência de apontamentos evita conflito com um site anterior e permite configurar a publicação de forma limpa quando o projeto estiver pronto.
