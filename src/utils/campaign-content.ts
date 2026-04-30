type CampaignContentInput = {
  name: string;
  description?: string | null;
  goal?: number | null;
  ticketGoal?: number | null;
  currentTickets?: number | null;
  createdAt?: Date | string | null;
  ticketsCount?: number | null;
};

function normalizeText(text?: string | null) {
  return text?.replace(/\s+/g, " ").trim() || "";
}

function formatNumber(value?: number | null) {
  return Number(value || 0).toLocaleString("pt-BR");
}

function formatDate(value?: Date | string | null) {
  if (!value) return "data de publicacao recente";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function campaignTheme(campaign: CampaignContentInput) {
  const text = `${campaign.name} ${normalizeText(campaign.description)}`;

  if (/fog[aã]o|geladeira|eletro|m[oó]vel|casa|lar/i.test(text)) {
    return {
      purpose: "apoio domestico",
      impact: "organizar a rotina da casa com mais dignidade e seguranca",
      care: "confira se endereco, telefone e documento estao corretos para facilitar qualquer contato posterior",
      evidence: "itens de uso domestico costumam exigir confirmacao cuidadosa de contato e disponibilidade para entrega",
      preparation: "tenha um telefone ativo e um endereco de referencia atualizado antes de concluir o cadastro",
    };
  }

  if (/dinheiro|pix|mil|aux[ií]lio|valor|r\$/i.test(text)) {
    return {
      purpose: "apoio financeiro",
      impact: "dar folego para despesas importantes e escolhas urgentes do dia a dia",
      care: "mantenha seus dados bancarios e de contato atualizados somente nos canais oficiais",
      evidence: "campanhas com apoio financeiro exigem conferencia de identidade para evitar pagamentos indevidos",
      preparation: "use apenas dados proprios e revise o telefone, pois ele pode ser usado para contato administrativo",
    };
  }

  return {
    purpose: "campanha social",
    impact: "aproximar pessoas de uma oportunidade gratuita e acompanhada pela plataforma",
    care: "leia as regras da campanha e use apenas dados proprios durante o cadastro",
    evidence: "cada campanha precisa de registros consistentes para preservar a confiabilidade do processo",
    preparation: "separe um e-mail acessivel e revise seus dados antes de iniciar a inscricao",
  };
}

export function buildCampaignContent(campaign: CampaignContentInput) {
  const theme = campaignTheme(campaign);
  const description = normalizeText(campaign.description);
  const publicationDate = formatDate(campaign.createdAt);
  const ticketsCount = formatNumber(campaign.ticketsCount);
  const ticketGoal = formatNumber(campaign.ticketGoal);
  const currentTickets = formatNumber(campaign.currentTickets);
  const goal = formatNumber(campaign.goal);

  return {
    summary:
      description ||
      `${campaign.name} e uma iniciativa da Chave do Bem voltada a ${theme.purpose}, com participacao gratuita e acompanhamento pelos canais oficiais da plataforma.`,
    articleIntro: `${campaign.name} foi publicada em ${publicationDate} como uma campanha de ${theme.purpose}. O objetivo e ${theme.impact}, com um caminho de participacao simples e verificavel.`,
    articleContext: `A pagina inicial da campanha serve para apresentar a proposta antes de qualquer cadastro. Ela mostra o que esta sendo divulgado, quais cuidados merecem atencao e por que o participante deve seguir apenas o fluxo oficial.`,
    participationDetails: [
      `Meta operacional registrada: ${goal}. Esse valor orienta o acompanhamento interno da iniciativa.`,
      `Ciclo atual: ${currentTickets} ticket(s) registrados, com referencia administrativa de ${ticketGoal} ticket(s).`,
      theme.care,
    ],
    instructionIntro: `As instrucoes abaixo foram ajustadas para ${campaign.name}. Antes de prosseguir, confirme que voce reconhece a campanha, entende que a participacao e gratuita e sabe quais dados serao usados para validar seu ingresso.`,
    instructionTrust: `Como se trata de uma acao de ${theme.purpose}, os dados precisam pertencer ao proprio participante. Esse cuidado ajuda a manter a campanha auditavel e reduz problemas em contatos relacionados a resultado, suporte ou conferencia de informacoes.`,
    tutorialIntro: `Este tutorial mostra o caminho de cadastro e resgate para ${campaign.name}. Use as imagens de exemplo como referencia visual, mas preencha apenas dados reais e revise cada campo antes de enviar.`,
    tutorialAfterTicket: `Depois do resgate, o ingresso de ${campaign.name} fica vinculado ao seu perfil. Guarde seus dados de acesso, acompanhe os canais oficiais e evite repetir o processo em contas diferentes.`,
    finalCheck: `Voce esta na etapa final de ${campaign.name}. Confira a imagem, o nome da campanha e o login ativo antes de gerar o ingresso gratuito.`,
    overviewCards: [
      {
        title: "Proposito da campanha",
        body: `${campaign.name} foi organizada como ${theme.purpose}. Esta pagina concentra contexto, regras basicas e o caminho oficial de participacao.`,
      },
      {
        title: "Ponto de atencao",
        body: theme.evidence,
      },
      {
        title: "Prepare-se",
        body: theme.preparation,
      },
      {
        title: "Historico visivel",
        body: `Ha ${ticketsCount} ingresso(s) vinculados a esta campanha. Esse historico ajuda em consultas e suporte, mas nao substitui as regras publicadas.`,
      },
    ],
    processNotes: [
      `Publicada em ${publicationDate}, esta campanha pode receber avisos complementares nos canais oficiais.`,
      "O ingresso e individual, gratuito e associado ao perfil usado no momento do resgate.",
      "A plataforma nao pede pagamento, senha ou codigo de verificacao por conversas externas.",
    ],
    instructionCards: [
      {
        title: "Identidade",
        body: `Para ${campaign.name}, o cadastro deve representar uma pessoa real e maior de idade. Informacoes de terceiros podem impedir validacoes futuras.`,
      },
      {
        title: "Contato",
        body: "E-mail e WhatsApp precisam estar acessiveis. Eles ajudam no suporte, na recuperacao de acesso e em comunicados administrativos da campanha.",
      },
      {
        title: "Conduta",
        body: "Nao use VPN, automacoes, contas duplicadas ou documentos gerados. Esses sinais podem bloquear participacoes e prejudicar a analise da campanha.",
      },
    ],
    instructionSteps: [
      {
        title: "1. Conferencia inicial",
        body: `Leia a descricao de ${campaign.name}, confirme que esta no dominio oficial e verifique se a campanha exibida corresponde ao link acessado.`,
      },
      {
        title: "2. Cadastro verificavel",
        body: "Preencha os campos com dados que possam ser conferidos posteriormente. O objetivo e reduzir erros de contato, duplicidade e inconsistencias.",
      },
      {
        title: "3. Ingresso registrado",
        body: "Depois da validacao, o ingresso fica associado ao perfil autenticado e pode ser consultado no historico do participante.",
      },
    ],
    disqualificationItems: [
      "Documento invalido, gerado automaticamente ou pertencente a outra pessoa.",
      "Uso de VPN, proxy, script ou automacao para simular acessos.",
      "Multiplas contas usadas pelo mesmo participante para ampliar registros.",
      "Dados de contato inacessiveis ou divergentes dos informados no cadastro.",
      "Participacao de menor de idade ou cadastro feito sem consentimento adequado.",
    ],
    tutorialTips: [
      `Na etapa de cadastro de ${campaign.name}, confira cada campo antes de enviar. Uma letra incorreta no e-mail pode impedir a confirmacao.`,
      "Na validacao por e-mail, procure a mensagem tambem em Spam, Promocoes ou Lixo Eletronico antes de solicitar novo envio.",
      "No resgate, confirme se a imagem e o nome da campanha continuam corretos. Isso evita gerar ingresso na acao errada.",
    ],
    finalCards: [
      {
        title: "Confirme a campanha",
        body: `Antes do clique final, verifique se a tela mostra ${campaign.name} e se a imagem corresponde a campanha que voce escolheu.`,
      },
      {
        title: "Observe o intervalo",
        body: "Se existir contador ativo, aguarde o prazo terminar. Atualizar a pagina varias vezes nao libera novo ingresso antes da hora.",
      },
      {
        title: "Depois do resgate",
        body: "Consulte seu perfil para acompanhar o registro. Mensagens externas pedindo pagamento ou senha devem ser ignoradas.",
      },
    ],
  };
}
