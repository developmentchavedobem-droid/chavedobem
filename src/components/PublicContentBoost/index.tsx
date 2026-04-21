"use client";

const routeContent = [
  {
    match: (pathname: string) => pathname === "/",
    title: "Como a Chave do Bem aproxima campanhas de quem precisa",
    eyebrow: "Conteudo institucional",
    paragraphs: [
      "A Chave do Bem foi criada para facilitar o encontro entre pessoas interessadas em participar de campanhas gratuitas e iniciativas que oferecem apoio real. Nosso objetivo e tornar a experiencia simples, clara e acessivel, com informacoes suficientes para que cada visitante entenda o funcionamento da plataforma antes de criar uma conta ou retirar um ingresso.",
      "Na pagina inicial, reunimos campanhas ativas, caminhos de cadastro e links para areas importantes do site. A ideia e que qualquer pessoa consiga navegar com tranquilidade, conhecer as regras gerais, consultar politicas de privacidade e entender que a participacao nao exige pagamento, compra de produtos ou transferencia de valores.",
      "Tambem usamos este espaco para reforcar a importancia da transparencia. Cada campanha possui etapas proprias, orientacoes publicas e fluxo de validacao. O visitante deve ler as informacoes com atencao, manter seus dados atualizados e acompanhar os canais oficiais para receber avisos sobre resultados, prazos e proximas oportunidades.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/quem-somos"),
    title: "Nossa forma de atuar",
    eyebrow: "Identidade da plataforma",
    paragraphs: [
      "A Chave do Bem atua como uma plataforma independente de divulgacao, organizacao e acesso a campanhas. Nosso trabalho envolve tecnologia, comunicacao e processos internos para que as pessoas encontrem informacoes confiaveis, saibam como participar e tenham um ponto central de consulta sobre as iniciativas disponiveis.",
      "Acreditamos que uma plataforma social precisa explicar o que faz, como faz e quais limites possui. Por isso, buscamos manter conteudos claros sobre cadastro, privacidade, regras de participacao e canais de atendimento. Quanto mais transparente for a jornada, mais segura sera a experiencia para quem chega pela primeira vez.",
      "Nosso compromisso e melhorar continuamente a qualidade das informacoes publicadas. Textos, orientacoes e paginas institucionais sao parte da estrutura de confianca que sustenta o projeto, ajudando visitantes, participantes e parceiros a compreenderem o proposito da Chave do Bem.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/fale-conosco"),
    title: "Quando entrar em contato",
    eyebrow: "Atendimento e relacionamento",
    paragraphs: [
      "O canal Fale Conosco existe para orientar visitantes, participantes e interessados que tenham duvidas sobre cadastro, acesso a conta, campanhas ativas, recebimento de mensagens, regras de participacao ou atualizacao de dados. Antes de enviar sua solicitacao, recomendamos descrever o caso com clareza e informar um e-mail valido para retorno.",
      "Nossa equipe prioriza mensagens relacionadas a seguranca, inconsistencias cadastrais, dificuldades de acesso e duvidas sobre campanhas em andamento. Tambem recebemos sugestoes de melhoria, relatos de experiencia e pedidos de esclarecimento sobre politicas publicadas no site.",
      "A Chave do Bem nunca solicita senhas, codigos de autenticacao ou transferencias financeiras por canais informais. Caso receba uma abordagem suspeita em nome da plataforma, utilize esta pagina para nos avisar e aguarde contato pelos meios oficiais.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/doacoes") || pathname.includes("/cadastre-se") || pathname.includes("/sorteios"),
    title: "Entenda as campanhas disponiveis",
    eyebrow: "Participacao gratuita",
    paragraphs: [
      "As campanhas listadas nesta area representam oportunidades de participacao gratuita disponibilizadas pela Chave do Bem. Cada card apresenta informacoes basicas para que o visitante identifique a iniciativa, acesse os detalhes e siga o fluxo correto antes de retirar seu ingresso.",
      "Recomendamos que o participante leia a pagina da campanha, consulte as instrucoes oficiais e mantenha seus dados pessoais atualizados. Essa etapa e importante porque o contato com participantes selecionados depende de informacoes corretas, como e-mail, telefone e dados de identificacao.",
      "A participacao nao deve ser confundida com compra, aposta ou doacao obrigatoria. O cadastro e gratuito, e qualquer comunicacao que solicite pagamento antecipado deve ser desconsiderada e informada a equipe da plataforma por meio dos canais oficiais.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/politica-privacidade"),
    title: "Por que a privacidade importa na participacao",
    eyebrow: "Dados pessoais",
    paragraphs: [
      "Uma plataforma que realiza cadastro de participantes precisa tratar dados pessoais com responsabilidade. Informacoes como nome, e-mail, telefone e documentos podem ser necessarias para identificar usuarios, evitar duplicidade, prevenir fraudes e permitir contato em caso de selecao em campanhas.",
      "A Chave do Bem busca coletar apenas dados relacionados a finalidade da plataforma. O uso dessas informacoes deve estar vinculado a cadastro, autenticacao, comunicacao, seguranca, melhoria de experiencia e cumprimento de obrigacoes legais quando aplicavel.",
      "O usuario pode revisar esta politica sempre que desejar para compreender quais informacoes sao tratadas, como os cookies ajudam no funcionamento do site e quais cuidados sao esperados durante a navegacao.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/termos-uso"),
    title: "Leitura recomendada antes de participar",
    eyebrow: "Regras e responsabilidade",
    paragraphs: [
      "Os Termos de Uso explicam as condicoes basicas para navegar no site e participar das campanhas. A leitura e importante porque define responsabilidades do participante, criterios de cadastro, cuidados com informacoes pessoais e limites de uso da plataforma.",
      "Ao participar de uma campanha, o usuario declara que compreende as regras publicadas e que forneceu dados verdadeiros. Esse compromisso ajuda a proteger a integridade das iniciativas e reduz problemas relacionados a contas duplicadas, documentos invalidos ou informacoes incompletas.",
      "Sempre que houver duvida sobre alguma regra, recomendamos consultar os canais oficiais antes de prosseguir. A Chave do Bem valoriza uma participacao consciente, informada e alinhada com as condicoes apresentadas publicamente.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/perfil"),
    title: "Acompanhe sua participacao com responsabilidade",
    eyebrow: "Area do participante",
    paragraphs: [
      "A area de perfil permite que o participante acompanhe seus ingressos, revise informacoes pessoais e consulte campanhas em que ja participou. Manter esses dados corretos e uma medida simples que ajuda a equipe a realizar contatos de forma mais rapida quando necessario.",
      "Sempre que houver alteracao de telefone, e-mail ou documento, recomendamos atualizar o cadastro antes de retirar novos ingressos. Informacoes inconsistentes podem dificultar verificacoes e atrasar processos ligados a campanhas.",
      "O perfil tambem funciona como um registro pessoal de participacao. Ele ajuda o usuario a entender sua propria atividade na plataforma e oferece um ponto central para acessar novas oportunidades de forma organizada.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/campanha/") && pathname.includes("/instrucoes"),
    title: "Leia as instrucoes com calma",
    eyebrow: "Etapa de orientacao",
    paragraphs: [
      "A pagina de instrucoes existe para reduzir erros durante o cadastro e o resgate de ingressos. Ela apresenta criterios de validacao, cuidados com seguranca e situacoes que podem impedir a participacao correta em uma campanha.",
      "Ao avancar, o participante confirma que compreendeu as etapas principais e que esta disposto a seguir as regras publicadas. Esse processo ajuda a manter a campanha organizada e melhora a qualidade das informacoes registradas no sistema.",
      "Caso algo pareca diferente do esperado, o ideal e interromper o processo e procurar os canais oficiais. A Chave do Bem nao orienta participantes por links suspeitos ou mensagens que solicitem pagamentos externos.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/campanha/") && pathname.includes("/tutorial"),
    title: "Use o tutorial como checklist",
    eyebrow: "Guia passo a passo",
    paragraphs: [
      "O tutorial mostra, de forma visual e textual, como preencher o cadastro, confirmar o e-mail e acessar a campanha. Ele foi criado para ajudar novos participantes a evitarem erros comuns, especialmente em dispositivos moveis.",
      "Cada etapa deve ser concluida com atencao. Um e-mail digitado incorretamente, um telefone desatualizado ou um documento invalido podem comprometer a comunicacao e dificultar a validacao da participacao.",
      "Depois de concluir o tutorial, o participante segue para a area de resgate. O ingresso gratuito e gerado pelo sistema conforme as regras de tempo, autenticacao e disponibilidade da campanha ativa.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/campanha/") && pathname.includes("/participar"),
    title: "Antes de resgatar seu ingresso",
    eyebrow: "Confirmacao final",
    paragraphs: [
      "A tela de participacao e o ultimo passo antes de gerar o ingresso gratuito. Nela, o participante visualiza a campanha selecionada, o numero de participantes registrados e as condicoes de tempo para novos resgates.",
      "O intervalo entre resgates ajuda a manter uma distribuicao mais equilibrada e evita uso excessivo ou automatizado da plataforma. Essa regra tambem protege a experiencia dos demais participantes.",
      "Apos o resgate, o ingresso fica vinculado ao perfil do usuario. Por isso, e importante realizar a acao logado na conta correta e acompanhar o historico pessoal sempre que desejar consultar suas participacoes.",
    ],
  },
  {
    match: (pathname: string) => pathname.includes("/campanha/"),
    title: "Informacoes importantes sobre esta campanha",
    eyebrow: "Detalhes da campanha",
    paragraphs: [
      "Cada campanha publicada na Chave do Bem possui uma pagina propria para reunir descricao, orientacoes, criterios de participacao e avisos relevantes. Essa organizacao ajuda o visitante a tomar uma decisao informada antes de seguir para o cadastro.",
      "A leitura completa da pagina e recomendada para todos os participantes. Alem de apresentar o objetivo da campanha, o conteudo explica como ocorre o resgate gratuito, quais etapas precisam ser cumpridas e por que manter dados atualizados e essencial.",
      "A Chave do Bem busca oferecer paginas claras e acessiveis, evitando promessas confusas ou mensagens que possam induzir o usuario a erro. A participacao deve acontecer de forma consciente, segura e sem custos obrigatorios.",
    ],
  },
];

const fallbackContent = {
  title: "Informacoes gerais sobre a Chave do Bem",
  eyebrow: "Central de ajuda",
  paragraphs: [
    "A Chave do Bem reune paginas publicas para explicar sua proposta, apresentar campanhas, orientar participantes e publicar regras de uso. Esses conteudos ajudam visitantes a entenderem a plataforma antes de realizar qualquer cadastro.",
    "Nossa prioridade e oferecer uma navegacao clara, com informacoes acessiveis sobre privacidade, participacao gratuita, seguranca e contato. Sempre que uma campanha estiver ativa, o participante deve ler as instrucoes especificas antes de prosseguir.",
    "A plataforma nao exige pagamentos para participacao em campanhas e recomenda que qualquer comunicacao suspeita seja verificada nos canais oficiais.",
  ],
};

export default function PublicContentBoost({ pathname }: { pathname: string }) {
  const content = routeContent.find((item) => item.match(pathname)) || fallbackContent;

  return (
    <section className="bg-white px-6 py-14 text-zinc-700">
      <article className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-3">
          <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">
            {content.eyebrow}
          </p>
          <h2 className="text-2xl font-black tracking-tight text-[#053B80] md:text-3xl">
            {content.title}
          </h2>
        </div>

        <div className="space-y-4 text-base leading-7 text-zinc-600">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </section>
  );
}
