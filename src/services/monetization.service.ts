import prisma from "@/src/lib/prisma";

const PROMOTER_REVENUE_SHARE = 0.5;
const DEFAULT_CURRENCY = "BRL";
const DEFAULT_SOURCE_CURRENCY = "USD";
const DEFAULT_EXCHANGE_RATE_SOURCE = "bcb_ptax";

export type DailyAdSenseReportInput = {
  date: string | Date;
  estimatedEarnings: number;
  estimatedEarningsUsd?: number;
  exchangeRate?: number;
  exchangeRateDate?: string | Date;
  exchangeRateSource?: string;
  pageViews?: number;
  clicks?: number;
  impressions?: number;
  pageViewsRpm?: number;
  currency?: string;
  sourceCurrency?: string;
  source?: string;
  rawPayload?: unknown;
};

type GoogleAdSenseReportOptions = {
  date: string | Date;
  accessToken: string;
  account?: string;
  sourceCurrency?: string;
};

type GoogleAccessTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

type SyncAdSenseCronOptions = {
  trigger?: string;
  lookbackDays?: number;
};

type ReportMetricMap = {
  ESTIMATED_EARNINGS: number;
  PAGE_VIEWS: number;
  CLICKS: number;
  IMPRESSIONS: number;
  PAGE_VIEWS_RPM: number;
};

function normalizeReportDate(date: string | Date) {
  if (typeof date === "string") {
    const dateOnlyMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }
  }

  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    throw new Error("Data do relatorio invalida.");
  }

  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
}

function getDayRange(date: Date) {
  const start = normalizeReportDate(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 10000) / 10000;
}

function addDays(date: Date, amount: number) {
  const value = new Date(date);
  value.setUTCDate(value.getUTCDate() + amount);
  return value;
}

function formatBcbDate(date: Date) {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = String(date.getUTCFullYear());
  return `${month}-${day}-${year}`;
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function fetchUsdBrlExchangeRate(date: Date) {
  const configuredRate = Number(process.env.USD_BRL_EXCHANGE_RATE || 0);

  if (configuredRate > 0) {
    return {
      rate: configuredRate,
      date,
      source: "env_USD_BRL_EXCHANGE_RATE",
    };
  }

  const start = addDays(date, -7);
  const params = new URLSearchParams({
    "@dataInicial": `'${formatBcbDate(start)}'`,
    "@dataFinalCotacao": `'${formatBcbDate(date)}'`,
    "$top": "100",
    "$format": "json",
  });
  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?${params.toString()}`;

  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Falha ao buscar cotacao do dolar no Banco Central.");
  }

  const rows = Array.isArray(payload?.value) ? payload.value : [];
  const latest = rows
    .map((row: any) => ({
      rate: Number(row?.cotacaoVenda || row?.cotacaoCompra || 0),
      date: row?.dataHoraCotacao ? new Date(row.dataHoraCotacao) : null,
    }))
    .filter((row: { rate: number; date: Date | null }) => Number.isFinite(row.rate) && row.rate > 0 && row.date)
    .sort((a: { date: Date | null }, b: { date: Date | null }) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0))[0];

  if (!latest?.rate || !latest.date) {
    throw new Error(`Cotacao USD/BRL nao encontrada no Banco Central para ${dateOnly(date)} ou dias anteriores.`);
  }

  return {
    rate: latest.rate,
    date: normalizeReportDate(latest.date),
    source: DEFAULT_EXCHANGE_RATE_SOURCE,
  };
}

async function prepareReportMoney(input: DailyAdSenseReportInput) {
  const sourceCurrency = (input.sourceCurrency || input.currency || DEFAULT_SOURCE_CURRENCY).toUpperCase();
  const targetCurrency = DEFAULT_CURRENCY;
  const date = normalizeReportDate(input.date);

  if (sourceCurrency === "BRL") {
    const estimatedEarnings = roundMoney(input.estimatedEarnings);
    return {
      estimatedEarnings,
      estimatedEarningsUsd: roundMoney(input.estimatedEarningsUsd || 0),
      exchangeRate: input.exchangeRate || 1,
      exchangeRateDate: input.exchangeRateDate ? normalizeReportDate(input.exchangeRateDate) : date,
      exchangeRateSource: input.exchangeRateSource || "manual_brl",
      currency: targetCurrency,
      sourceCurrency,
    };
  }

  if (sourceCurrency !== "USD") {
    throw new Error(`Moeda de origem nao suportada: ${sourceCurrency}. Use USD ou BRL.`);
  }

  const estimatedEarningsUsd = roundMoney(input.estimatedEarningsUsd ?? input.estimatedEarnings);
  const exchange = input.exchangeRate && input.exchangeRate > 0
    ? {
        rate: input.exchangeRate,
        date: input.exchangeRateDate ? normalizeReportDate(input.exchangeRateDate) : date,
        source: input.exchangeRateSource || "manual",
      }
    : await fetchUsdBrlExchangeRate(date);

  return {
    estimatedEarnings: roundMoney(estimatedEarningsUsd * exchange.rate),
    estimatedEarningsUsd,
    exchangeRate: exchange.rate,
    exchangeRateDate: exchange.date,
    exchangeRateSource: exchange.source,
    currency: targetCurrency,
    sourceCurrency,
  };
}

function metricValue(report: any, metricName: keyof ReportMetricMap) {
  const headers = report?.headers || [];
  const cells = report?.rows?.[0]?.cells || report?.totals?.cells || [];
  const index = headers.findIndex((header: any) => header?.name === metricName);

  if (index < 0) return 0;

  const value = Number(cells[index]?.value || 0);
  return Number.isFinite(value) ? value : 0;
}

export async function fetchGoogleAdSenseDailyReport({
  date,
  accessToken,
  account = process.env.GOOGLE_ADSENSE_ACCOUNT,
  sourceCurrency = process.env.GOOGLE_ADSENSE_SOURCE_CURRENCY || DEFAULT_SOURCE_CURRENCY,
}: GoogleAdSenseReportOptions): Promise<DailyAdSenseReportInput> {
  if (!account) {
    throw new Error("Configure GOOGLE_ADSENSE_ACCOUNT no ambiente.");
  }

  const reportDate = normalizeReportDate(date);
  const params = new URLSearchParams();
  const metrics = ["ESTIMATED_EARNINGS", "PAGE_VIEWS", "CLICKS", "IMPRESSIONS", "PAGE_VIEWS_RPM"];

  params.append("dimensions", "DATE");
  metrics.forEach((metric) => params.append("metrics", metric));
  params.append("startDate.year", String(reportDate.getFullYear()));
  params.append("startDate.month", String(reportDate.getMonth() + 1));
  params.append("startDate.day", String(reportDate.getDate()));
  params.append("endDate.year", String(reportDate.getFullYear()));
  params.append("endDate.month", String(reportDate.getMonth() + 1));
  params.append("endDate.day", String(reportDate.getDate()));
  params.append("currencyCode", sourceCurrency);

  const response = await fetch(`https://adsense.googleapis.com/v2/${account}/reports:generate?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const rawPayload = await response.json();

  if (!response.ok) {
    throw new Error(rawPayload?.error?.message || "Falha ao buscar relatorio no Google AdSense.");
  }

  return {
    date: reportDate,
    estimatedEarnings: metricValue(rawPayload, "ESTIMATED_EARNINGS"),
    estimatedEarningsUsd: metricValue(rawPayload, "ESTIMATED_EARNINGS"),
    pageViews: metricValue(rawPayload, "PAGE_VIEWS"),
    clicks: metricValue(rawPayload, "CLICKS"),
    impressions: metricValue(rawPayload, "IMPRESSIONS"),
    pageViewsRpm: metricValue(rawPayload, "PAGE_VIEWS_RPM"),
    currency: DEFAULT_CURRENCY,
    sourceCurrency,
    source: "google_adsense_api",
    rawPayload,
  };
}

export async function getGoogleAdSenseAccessToken() {
  const clientId = process.env.GOOGLE_ADSENSE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADSENSE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADSENSE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Configure GOOGLE_ADSENSE_CLIENT_ID, GOOGLE_ADSENSE_CLIENT_SECRET e GOOGLE_ADSENSE_REFRESH_TOKEN.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as GoogleAccessTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "Falha ao renovar token do Google AdSense.");
  }

  return data.access_token;
}

export async function upsertAdSenseDailyReport(input: DailyAdSenseReportInput) {
  const date = normalizeReportDate(input.date);
  const money = await prepareReportMoney(input);

  return prisma.adSenseDailyReport.upsert({
    where: { date },
    create: {
      date,
      estimatedEarnings: money.estimatedEarnings,
      estimatedEarningsUsd: money.estimatedEarningsUsd,
      exchangeRate: money.exchangeRate,
      exchangeRateDate: money.exchangeRateDate,
      exchangeRateSource: money.exchangeRateSource,
      pageViews: input.pageViews || 0,
      clicks: input.clicks || 0,
      impressions: input.impressions || 0,
      pageViewsRpm: input.pageViewsRpm || 0,
      currency: money.currency,
      sourceCurrency: money.sourceCurrency,
      source: input.source || "manual",
      rawPayload: input.rawPayload as any,
      fetchedAt: new Date(),
    },
    update: {
      estimatedEarnings: money.estimatedEarnings,
      estimatedEarningsUsd: money.estimatedEarningsUsd,
      exchangeRate: money.exchangeRate,
      exchangeRateDate: money.exchangeRateDate,
      exchangeRateSource: money.exchangeRateSource,
      pageViews: input.pageViews || 0,
      clicks: input.clicks || 0,
      impressions: input.impressions || 0,
      pageViewsRpm: input.pageViewsRpm || 0,
      currency: money.currency,
      sourceCurrency: money.sourceCurrency,
      source: input.source || "manual",
      rawPayload: input.rawPayload as any,
      fetchedAt: new Date(),
    },
  });
}

export async function recalculateDailyPromoterEarnings(date: string | Date) {
  const reportDate = normalizeReportDate(date);
  const { start, end } = getDayRange(reportDate);

  const report = await prisma.adSenseDailyReport.findUnique({
    where: { date: reportDate },
  });

  if (!report) {
    throw new Error("Relatorio diario do AdSense nao encontrado.");
  }

  const [visits, tickets] = await Promise.all([
    prisma.visit.findMany({
      where: {
        createdAt: { gte: start, lt: end },
      },
      select: {
        campaignId: true,
        referral: {
          select: { profileId: true },
        },
      },
    }),
    prisma.ticket.findMany({
      where: {
        createdAt: { gte: start, lt: end },
        referralLinkId: { not: null },
      },
      select: {
        campaignId: true,
        referralLink: {
          select: { profileId: true },
        },
      },
    }),
  ]);

  const totalValidVisits = visits.length;
  const revenuePerVisit = totalValidVisits > 0 ? Number(report.estimatedEarnings) / totalValidVisits : 0;
  const grouped = new Map<string, { profileId: number; campaignId: number; validVisits: number; tickets: number }>();

  for (const visit of visits) {
    const profileId = visit.referral.profileId;
    const key = `${profileId}:${visit.campaignId}`;
    const current = grouped.get(key) || {
      profileId,
      campaignId: visit.campaignId,
      validVisits: 0,
      tickets: 0,
    };

    current.validVisits += 1;
    grouped.set(key, current);
  }

  for (const ticket of tickets) {
    const profileId = ticket.referralLink?.profileId;
    if (!profileId) continue;

    const key = `${profileId}:${ticket.campaignId}`;
    const current = grouped.get(key) || {
      profileId,
      campaignId: ticket.campaignId,
      validVisits: 0,
      tickets: 0,
    };

    current.tickets += 1;
    grouped.set(key, current);
  }

  const earnings = Array.from(grouped.values()).map((item) => {
    const grossRevenue = roundMoney(item.validVisits * revenuePerVisit);
    const promoterShare = roundMoney(grossRevenue * PROMOTER_REVENUE_SHARE);
    const platformShare = roundMoney(grossRevenue - promoterShare);

    return {
      ...item,
      grossRevenue,
      promoterShare,
      platformShare,
    };
  });

  await prisma.$transaction(async (tx) => {
    const existing = await tx.promoterDailyEarning.findMany({
      where: { date: reportDate },
      select: { id: true, profileId: true, campaignId: true, status: true },
    });
    const existingByKey = new Map(existing.map((earning) => [`${earning.profileId}:${earning.campaignId}`, earning]));
    const activeKeys = new Set(earnings.map((earning) => `${earning.profileId}:${earning.campaignId}`));
    const staleIds = existing
      .filter((earning) => earning.status !== "PAID" && !activeKeys.has(`${earning.profileId}:${earning.campaignId}`))
      .map((earning) => earning.id);

    if (staleIds.length > 0) {
      await tx.promoterDailyEarning.deleteMany({
        where: { id: { in: staleIds } },
      });
    }

    for (const earning of earnings) {
      const existingEarning = existingByKey.get(`${earning.profileId}:${earning.campaignId}`);
      if (existingEarning?.status === "PAID") continue;

      await tx.promoterDailyEarning.upsert({
        where: {
          date_profileId_campaignId: {
            date: reportDate,
            profileId: earning.profileId,
            campaignId: earning.campaignId,
          },
        },
        create: {
          date: reportDate,
          profileId: earning.profileId,
          campaignId: earning.campaignId,
          reportId: report.id,
          validVisits: earning.validVisits,
          tickets: earning.tickets,
          grossRevenue: earning.grossRevenue,
          promoterShare: earning.promoterShare,
          platformShare: earning.platformShare,
          status: "ESTIMATED",
        },
        update: {
          reportId: report.id,
          validVisits: earning.validVisits,
          tickets: earning.tickets,
          grossRevenue: earning.grossRevenue,
          promoterShare: earning.promoterShare,
          platformShare: earning.platformShare,
          status: "ESTIMATED",
        },
      });
    }
  });

  return {
    date: reportDate,
    totalValidVisits,
    revenuePerVisit: roundMoney(revenuePerVisit),
    grossRevenue: Number(report.estimatedEarnings),
    promoterRevenue: roundMoney(earnings.reduce((total, earning) => total + earning.promoterShare, 0)),
    platformRevenue: roundMoney(earnings.reduce((total, earning) => total + earning.platformShare, 0)),
    rows: earnings.length,
  };
}

export async function syncDailyAdSenseReport(input: DailyAdSenseReportInput) {
  const report = await upsertAdSenseDailyReport(input);
  const allocation = await recalculateDailyPromoterEarnings(report.date);

  return { report, allocation };
}

export async function syncRecentAdSenseReports({ trigger = "cron", lookbackDays }: SyncAdSenseCronOptions = {}) {
  const configuredLookback = Number(process.env.GOOGLE_ADSENSE_SYNC_LOOKBACK_DAYS || 7);
  const daysToSync = Math.max(1, Math.min(lookbackDays || configuredLookback, 30));
  const log = await prisma.cronSyncLog.create({
    data: {
      job: "adsense-daily-sync",
      trigger,
      daysRequested: daysToSync,
      status: "RUNNING",
    },
  });

  try {
    const accessToken = await getGoogleAdSenseAccessToken();
    const sourceCurrency = process.env.GOOGLE_ADSENSE_SOURCE_CURRENCY || DEFAULT_SOURCE_CURRENCY;
    const today = normalizeReportDate(new Date());
    const synced = [];

    for (let offset = 0; offset < daysToSync; offset += 1) {
      const date = addDays(today, -offset);
      const reportInput = await fetchGoogleAdSenseDailyReport({
        date,
        accessToken,
        sourceCurrency,
      });
      const result = await syncDailyAdSenseReport(reportInput);

      synced.push({
        date: result.allocation.date.toISOString().slice(0, 10),
        totalValidVisits: result.allocation.totalValidVisits,
        revenuePerVisit: result.allocation.revenuePerVisit,
        grossRevenue: result.allocation.grossRevenue,
        promoterRevenue: result.allocation.promoterRevenue,
        platformRevenue: result.allocation.platformRevenue,
        estimatedEarningsUsd: Number(result.report.estimatedEarningsUsd),
        exchangeRate: Number(result.report.exchangeRate),
        exchangeRateDate: result.report.exchangeRateDate?.toISOString().slice(0, 10),
        exchangeRateSource: result.report.exchangeRateSource,
        rows: result.allocation.rows,
      });
    }

    const updatedLog = await prisma.cronSyncLog.update({
      where: { id: log.id },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        syncedDays: synced.length,
        message: `${synced.length} dias sincronizados com sucesso.`,
        details: { synced },
      },
    });

    return { log: updatedLog, synced };
  } catch (error: any) {
    const updatedLog = await prisma.cronSyncLog.update({
      where: { id: log.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        error: error?.message || "Erro desconhecido ao sincronizar AdSense.",
      },
    });

    throw Object.assign(error, { cronLog: updatedLog });
  }
}
