# Chave do Bem - Guia do Administrador

Este documento explica o funcionamento do sistema para um administrador, sem exigir conhecimento tecnico profundo.


## Visao geral

A Chave do Bem organiza campanhas publicas com paginas informativas e anuncios. Divulgadores recebem links proprios para divulgar. Quando uma pessoa acessa esses links e navega pelas paginas com anuncios, o sistema registra visitas validas. A receita do Google AdSense e importada para o sistema e distribuida proporcionalmente entre os divulgadores que geraram essas visitas.

O modelo financeiro atual e:

- 50% da receita gerada fica para a plataforma.
- 50% da receita gerada fica para o divulgador.
- O administrador ve a receita bruta, o repasse dos divulgadores e a parte da plataforma.
- O divulgador ve apenas a parte dele.

## Perfis de usuario

### Administrador

Pode criar campanhas, criar divulgadores, acompanhar faturamento geral, acompanhar solicitacoes de pagamento e verificar logs do cron de sincronizacao com o AdSense.

### Divulgador

Recebe links de divulgacao, acompanha visitas, tickets e faturamento atribuido aos links dele, e pode solicitar pagamento do mes anterior quando houver valor disponivel.

### Participante

Pessoa comum que acessa uma campanha, le as paginas informativas e pode retirar um ticket para participar. O participante so pode retirar um ticket a cada 3 horas.

## Modulos do sistema

### Home

Mostra o resumo operacional.

Para administradores, apresenta uma visao geral de receita estimada, visitas, tickets e desempenho por rede.

Para divulgadores, apresenta a receita estimada do periodo, visitas, tickets e os links de divulgacao por rede social.

### Minhas Campanhas

Disponivel somente para administradores.

Permite criar, editar, excluir e acompanhar campanhas. Os cards exibem:

- Valor arrecadado pela campanha.
- Progresso em relacao a meta de renda.
- Quantidade de visitas validas.
- Quantidade de tickets emitidos.

Nos detalhes da campanha, quando a meta de renda ou a meta de tickets for atingida, o administrador pode realizar o sorteio de ganhadores. O sistema permite escolher quantos ganhadores serao sorteados e considera apenas participantes unicos que retiraram ticket na campanha.

Cada sorteio fica registrado com:

- data e hora;
- quantidade de ganhadores solicitada;
- quantidade de participantes unicos;
- seed do sorteio;
- ganhadores escolhidos;
- ticket usado como referencia para cada ganhador.

Depois do sorteio, a campanha e marcada como `FINISHED`.

### Faturamento

Mostra a receita calculada pelo sistema.

Para administradores:

- Faturamento bruto do periodo.
- Parte estimada dos divulgadores.
- Parte estimada da plataforma.
- Visitas e tickets.
- Lista de divulgadores no periodo.
- Solicitacoes de pagamento.

Para divulgadores:

- Faturamento selecionado.
- Valor disponivel do mes anterior.
- Historico de solicitacoes.
- Envio de nota fiscal em PDF para solicitar pagamento.

### Usuarios

Disponivel somente para administradores.

Permite criar usuarios divulgadores. Ao criar um divulgador, o sistema gera links de divulgacao para plataformas como Instagram, WhatsApp, Facebook, TikTok, X, LinkedIn, YouTube e Geral.

### Logs do Cron

Disponivel somente para administradores.

Mostra as execucoes automaticas da sincronizacao do AdSense. O administrador consegue ver:

- Ultimo sucesso.
- Ultima falha.
- Quantidade de dias processados.
- Status de cada execucao.
- Mensagens de erro.

## Como funciona a divulgacao

Cada divulgador possui links com um codigo unico, por exemplo:

```txt
https://chavedobem.com/participe?ref=ig-abc123
```

Quando uma pessoa acessa esse link, o sistema salva o codigo em um cookie chamado `chave_ref`. Esse cookie permite atribuir as visitas e tickets ao divulgador correto durante a navegacao.

## Como funcionam as visitas validas

As paginas monetizaveis atualmente rastreadas sao:

- `/campanha/[slug]`
- `/campanha/[slug]/instrucoes`
- `/campanha/[slug]/tutorial`

Quando uma pessoa visita uma dessas paginas com um codigo de divulgacao, o sistema registra uma linha na tabela `Visit`.

Para evitar abuso, o mesmo IP nao gera nova visita para a mesma campanha, mesma pagina e mesmo divulgador dentro de 3 horas.

Exemplo:

```txt
Mesmo IP + mesma campanha + mesma pagina + mesmo divulgador = bloqueado por 3 horas
Mesmo IP + mesma campanha + outra pagina = permitido
Mesmo IP + outra campanha = permitido
Mesmo IP + outro divulgador = permitido
```

## Como funcionam os tickets

O ticket representa a participacao do usuario comum em uma campanha. Ele nao e mais usado como base principal de monetizacao.

O ticket serve para:

- Medir conversao.
- Controlar participacao.
- Evitar retirada repetida.
- Acompanhar meta de tickets da campanha.

O usuario comum so pode retirar um ticket a cada 3 horas.

## Como funciona a monetizacao

O sistema usa relatorios do Google AdSense para saber quanto foi gerado em um dia. Como o AdSense trabalha com receita em dolar, o sistema converte o valor para real usando a cotacao USD/BRL do dia.

A cotacao padrao vem da PTAX do Banco Central do Brasil. Se a cotacao do dia ainda nao estiver disponivel, o sistema busca a cotacao mais recente dos dias anteriores.

Exemplo:

```txt
Receita AdSense do dia: US$ 20,00
Cotacao usada: R$ 5,00
Receita convertida: R$ 100,00
Visitas validas do dia: 2
Valor medio por visita: R$ 50,00
```

Se um divulgador gerou as 2 visitas:

```txt
Receita bruta atribuida: R$ 100,00
Divulgador recebe: R$ 50,00
Plataforma retém: R$ 50,00
```

O sistema grava esse resultado em `PromoterDailyEarning`.

## Tabelas principais

### Visit

Registra visitas validas em paginas com anuncios.

### Ticket

Registra tickets retirados por participantes.

### CampaignDraw

Guarda cada sorteio realizado em uma campanha.

### CampaignWinner

Guarda os ganhadores de cada sorteio e o ticket usado como referencia.

### AdSenseDailyReport

Guarda o relatorio diario importado do Google AdSense, o valor original em dolar, a cotacao usada e o valor convertido em real.

### PromoterDailyEarning

Guarda a divisao diaria da receita por divulgador e campanha.

### CronSyncLog

Guarda logs das sincronizacoes automaticas com o Google AdSense.

### Withdrawal

Guarda solicitacoes de pagamento dos divulgadores.

## Fechamento e pagamento

O divulgador solicita pagamento do mes anterior. Quando o administrador marca a solicitacao como paga, os ganhos daquele periodo sao marcados como `PAID`. Ganhos pagos nao devem ser recalculados.

## Rotina recomendada para o administrador

1. Criar campanhas com meta de renda e meta de tickets.
2. Criar divulgadores.
3. Garantir que os divulgadores usem seus links corretos.
4. Acompanhar visitas e receita em Home e Faturamento.
5. Verificar o modulo Logs do Cron caso a receita pare de atualizar.
6. Conferir solicitacoes de pagamento.
7. Marcar pagamentos como pagos somente apos anexar o comprovante.

## Observacao sobre valores

Os valores do AdSense sao estimativas e podem mudar por ajustes do Google, trafego invalido ou atraso de processamento. Por isso o sistema recalcula dias recentes automaticamente. Periodos ja pagos sao preservados.

## Configuracao de storage

Uploads de imagens de campanhas e PDFs de faturamento usam assinatura gerada pelo servidor e fazem envio direto do navegador para o Cloudinary.

Configure as variaveis abaixo no ambiente:

```txt
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

As imagens sao enviadas para a pasta `campanhas`. PDFs de faturamento sao enviados para `finance/notas-fiscais` ou `finance/comprovantes`.

## Configuracao de banco

O sistema usa Prisma com PostgreSQL. Para Supabase, configure:

```txt
DATABASE_URL=postgresql://postgres:<senha>@db.<project-ref>.supabase.co:5432/postgres?schema=public&sslmode=require
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```
