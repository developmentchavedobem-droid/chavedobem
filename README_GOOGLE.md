# Integracao com Google AdSense

Este guia explica como ligar o sistema ao Google AdSense para que o cron importe os ganhos automaticamente e recalcule a monetizacao a cada execucao.

## O que o cron faz

O cron chama a rota:

```text
GET /api/cron/adsense-sync
```

A cada execucao, o sistema:

1. Busca os relatorios diarios recentes no Google AdSense.
2. Busca a cotacao USD/BRL do dia pela PTAX do Banco Central do Brasil.
3. Salva ou atualiza os dados em `AdSenseDailyReport`.
4. Recalcula o valor por visita valida do dia em reais.
5. Distribui a receita entre os divulgadores em `PromoterDailyEarning`.
6. Divide cada receita em 50% para o divulgador e 50% para a plataforma.
7. Registra o resultado em `CronSyncLog`.

O agendamento configurado em `vercel.json` executa a rota a cada 10 minutos:

```json
{
  "crons": [
    {
      "path": "/api/cron/adsense-sync",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

## Variaveis de ambiente

Configure as variaveis abaixo no `.env` local e tambem no ambiente de producao:

```env
CRON_SECRET="uma-chave-secreta-forte"

GOOGLE_ADSENSE_ACCOUNT="accounts/pub-0000000000000000"
GOOGLE_ADSENSE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_ADSENSE_CLIENT_SECRET="seu-client-secret"
GOOGLE_ADSENSE_REFRESH_TOKEN="seu-refresh-token"
GOOGLE_ADSENSE_SOURCE_CURRENCY="USD"
GOOGLE_ADSENSE_SYNC_LOOKBACK_DAYS="7"
```

### Sobre cada variavel

`CRON_SECRET`: chave usada para proteger a rota do cron. Sem ela, qualquer pessoa poderia tentar acionar a sincronizacao.

`GOOGLE_ADSENSE_ACCOUNT`: identificador da conta no formato `accounts/pub-...`.

`GOOGLE_ADSENSE_CLIENT_ID`: client id OAuth criado no Google Cloud.

`GOOGLE_ADSENSE_CLIENT_SECRET`: segredo do client OAuth.

`GOOGLE_ADSENSE_REFRESH_TOKEN`: token permanente usado pelo sistema para gerar access tokens automaticamente.

`GOOGLE_ADSENSE_SOURCE_CURRENCY`: moeda original usada na consulta do AdSense. Use `USD`.

`GOOGLE_ADSENSE_SYNC_LOOKBACK_DAYS`: quantidade de dias recentes que o cron deve recalcular. O padrao e `7`.

Opcionalmente, em ambiente de teste, voce pode fixar uma cotacao manual:

```env
USD_BRL_EXCHANGE_RATE="5.00"
```

Quando essa variavel existe, o sistema deixa de buscar a PTAX e usa esse valor fixo. Nao e recomendado usar isso em producao.

## Passo a passo no Google Cloud

1. Acesse o Google Cloud Console.
2. Crie ou selecione um projeto.
3. Ative a API `AdSense Management API`.
4. Configure a tela de consentimento OAuth.
5. Crie uma credencial do tipo `OAuth client ID`.
6. Escolha o tipo `Web application`.
7. Copie o `Client ID` e o `Client Secret`.
8. Adicione uma URL de redirecionamento temporaria para gerar o refresh token.

Documentacao oficial:

- Google AdSense Management API: https://developers.google.com/adsense/management
- OAuth 2.0 para apps web: https://developers.google.com/identity/protocols/oauth2/web-server
- Escopos OAuth do AdSense: https://developers.google.com/adsense/management/reference/rest
- Dados abertos do Banco Central: https://opendata.bcb.gov.br/
- API PTAX do Banco Central: https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/documentacao

## Como obter o refresh token

Voce precisa autorizar a conta Google dona do AdSense com o escopo:

```text
https://www.googleapis.com/auth/adsense.readonly
```

Monte uma URL de autorizacao parecida com esta, trocando os valores:

```text
https://accounts.google.com/o/oauth2/v2/auth?client_id=SEU_CLIENT_ID&redirect_uri=SUA_URL_DE_REDIRECT&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadsense.readonly&access_type=offline&prompt=consent
```

Depois de acessar a URL e aprovar, o Google redirecionara para a URL configurada com um parametro `code`.

Troque esse `code` por tokens fazendo uma requisicao `POST` para:

```text
https://oauth2.googleapis.com/token
```

Com os campos:

```json
{
  "code": "CODIGO_RECEBIDO_NO_REDIRECT",
  "client_id": "SEU_CLIENT_ID",
  "client_secret": "SEU_CLIENT_SECRET",
  "redirect_uri": "SUA_URL_DE_REDIRECT",
  "grant_type": "authorization_code"
}
```

A resposta deve conter `refresh_token`. Esse valor vai para `GOOGLE_ADSENSE_REFRESH_TOKEN`.

Importante: o Google so retorna `refresh_token` quando a autorizacao pede `access_type=offline`. Se o token nao vier, revogue o acesso do app na conta Google e gere novamente usando tambem `prompt=consent`.

## Como descobrir o GOOGLE_ADSENSE_ACCOUNT

Com um access token valido, chame:

```text
GET https://adsense.googleapis.com/v2/accounts
```

A resposta deve trazer contas no formato:

```json
{
  "accounts": [
    {
      "name": "accounts/pub-0000000000000000",
      "displayName": "Minha conta AdSense"
    }
  ]
}
```

Use o valor de `name` em `GOOGLE_ADSENSE_ACCOUNT`.

## Teste manual do cron

Com o servidor local rodando, acesse:

```text
http://localhost:3000/api/cron/adsense-sync?secret=SUA_CHAVE&days=7
```

Ou use fetch no console do navegador:

```js
fetch("/api/cron/adsense-sync?secret=SUA_CHAVE&days=7")
  .then((response) => response.json())
  .then(console.log);
```

Em producao, a chamada recomendada usa header:

```text
Authorization: Bearer SUA_CHAVE
```

## Como conferir se funcionou

No painel administrativo, acesse:

```text
Logs do Cron
```

La voce vera:

- horario de inicio e fim;
- status da execucao;
- quantos relatorios foram importados;
- quantas visitas validas foram recalculadas;
- receita bruta convertida para BRL;
- repasse dos divulgadores;
- receita da plataforma;
- mensagem de erro, caso exista.

Voce tambem pode conferir as tabelas:

- `AdSenseDailyReport`: relatorio diario importado do AdSense, com valor original em USD, cotacao usada e valor convertido em BRL;
- `PromoterDailyEarning`: distribuicao da receita por divulgador e campanha;
- `CronSyncLog`: historico de execucoes do cron.

## Recalculos

O AdSense pode ajustar valores depois do dia corrente. Por isso o cron recalcula os ultimos dias, e nao apenas o dia atual.

Exemplo: se `GOOGLE_ADSENSE_SYNC_LOOKBACK_DAYS=7`, a cada 10 minutos o sistema tenta atualizar os ultimos 7 dias. Se o Google alterar o valor estimado de ontem, o sistema tambem ajusta os ganhos dos divulgadores daquele dia.

Ganhos marcados como `PAID` nao devem ser tratados como saldo aberto para pagamento.

## Problemas comuns

### 401 ou invalid_grant

O refresh token esta invalido, foi revogado ou foi gerado para outro client OAuth. Gere um novo token.

### 403 permission denied

A conta Google autorizada nao tem acesso ao AdSense ou a API nao esta ativada no Google Cloud.

### Relatorio sem valores

Pode acontecer quando o AdSense ainda nao disponibilizou dados para o dia. O cron continuara tentando nas proximas execucoes.

### Cron nao executa em producao

Confira se:

- o deploy esta em uma plataforma que suporta cron;
- `vercel.json` foi enviado no deploy;
- `CRON_SECRET` esta configurado;
- a rota `/api/cron/adsense-sync` responde manualmente;
- os logs aparecem em `Logs do Cron`.

## Observacao importante

O sistema estima a receita de cada divulgador dividindo a receita diaria do AdSense, ja convertida de USD para BRL, pelas visitas validas registradas nas paginas com anuncios. Esse metodo nao tenta atribuir receita por clique individual, porque o AdSense nao entrega esse nivel de detalhe por visitante. A distribuicao e proporcional as visitas validas geradas por cada divulgador e campanha.
