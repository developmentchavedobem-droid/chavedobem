"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/src/lib/prisma";
import { createSignedCloudinaryUpload } from "@/src/lib/cloudinary";

type AuthPayload = {
  sub: string;
  role: "ADMIN" | "USER" | "CUSTOMER";
  email: string;
};

type FinancePeriod = {
  month?: number;
  year?: number;
  scope?: "month" | "year";
};

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  } catch {
    return null;
  }
}

function getPreviousMonth(date = new Date()) {
  const previous = new Date(date.getFullYear(), date.getMonth() - 1, 1);

  return {
    month: previous.getMonth() + 1,
    year: previous.getFullYear(),
  };
}

function getPeriodRange(period: FinancePeriod) {
  const now = new Date();
  const year = period.year || now.getFullYear();
  const month = period.month || now.getMonth() + 1;

  if (period.scope === "year") {
    return {
      month,
      year,
      start: new Date(year, 0, 1),
      end: new Date(year + 1, 0, 1),
    };
  }

  return {
    month,
    year,
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1),
  };
}

function formatWithdrawal(withdrawal: any) {
  return {
    id: withdrawal.id,
    amount: withdrawal.amount,
    status: withdrawal.status,
    referenceMonth: withdrawal.referenceMonth,
    referenceYear: withdrawal.referenceYear,
    invoiceUrl: withdrawal.invoiceUrl,
    receiptUrl: withdrawal.receiptUrl,
    createdAt: withdrawal.createdAt.toISOString(),
    paidAt: withdrawal.paidAt?.toISOString() || null,
    userName: withdrawal.wallet?.profile?.name || null,
    userEmail: withdrawal.wallet?.profile?.user?.email || null,
  };
}

async function sumPromoterRevenue(where: any) {
  const earnings = await prisma.promoterDailyEarning.findMany({
    where,
    select: {
      promoterShare: true,
    },
  });

  return earnings.reduce((total, earning) => total + Number(earning.promoterShare || 0), 0);
}

async function sumGrossRevenue(where: any) {
  const earnings = await prisma.promoterDailyEarning.findMany({
    where,
    select: {
      grossRevenue: true,
    },
  });

  return earnings.reduce((total, earning) => total + Number(earning.grossRevenue || 0), 0);
}

export async function getFinanceUploadUrl(fileName: string, fileType: string, kind: "invoice" | "receipt") {
  const session = await getSession();

  if (!session || !["ADMIN", "USER"].includes(session.role)) {
    return { success: false as const, error: "Nao autorizado." };
  }

  if (fileType !== "application/pdf") {
    return { success: false as const, error: "Envie um arquivo PDF." };
  }

  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "pdf";

  try {
    const upload = createSignedCloudinaryUpload({
      folder: `finance/${kind === "invoice" ? "notas-fiscais" : "comprovantes"}`,
      publicId: `${uuidv4()}.${fileExtension}`,
      fileType,
    });

    return {
      success: true as const,
      ...upload,
    };
  } catch (error) {
    console.error("Erro ao preparar upload financeiro:", error);
    return { success: false as const, error: "Falha ao preparar upload." };
  }
}

export async function getFinanceDashboardAction(period: FinancePeriod = {}) {
  const session = await getSession();

  if (!session || !["ADMIN", "USER"].includes(session.role)) {
    return { error: "Nao autorizado." };
  }

  const userId = Number(session.sub);
  const selectedRange = getPeriodRange(period);
  const previousPeriod = getPreviousMonth();
  const previousRange = getPeriodRange({
    month: previousPeriod.month,
    year: previousPeriod.year,
    scope: "month",
  });

  if (session.role === "USER") {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { wallet: true },
    });

    if (!profile?.wallet) {
      return { error: "Carteira nao encontrada." };
    }

    const previousEarningsWhere = {
      date: { gte: previousRange.start, lt: previousRange.end },
      profileId: profile.id,
    };

    const selectedEarningsWhere = {
      date: { gte: selectedRange.start, lt: selectedRange.end },
      profileId: profile.id,
    };

    const [previousRevenue, selectedRevenue, previousTickets, selectedTickets, previousVisits, selectedVisits, existingRequest, withdrawals] =
      await Promise.all([
        sumPromoterRevenue(previousEarningsWhere),
        sumPromoterRevenue(selectedEarningsWhere),
        prisma.ticket.count({
          where: {
            createdAt: { gte: previousRange.start, lt: previousRange.end },
            referralLink: { profileId: profile.id },
          },
        }),
        prisma.ticket.count({
          where: {
            createdAt: { gte: selectedRange.start, lt: selectedRange.end },
            referralLink: { profileId: profile.id },
          },
        }),
        prisma.visit.count({
          where: {
            createdAt: { gte: previousRange.start, lt: previousRange.end },
            referral: { profileId: profile.id },
          },
        }),
        prisma.visit.count({
          where: {
            createdAt: { gte: selectedRange.start, lt: selectedRange.end },
            referral: { profileId: profile.id },
          },
        }),
        prisma.withdrawal.findFirst({
          where: {
            walletId: profile.wallet.id,
            referenceMonth: previousPeriod.month,
            referenceYear: previousPeriod.year,
          },
        }),
        prisma.withdrawal.findMany({
          where: { walletId: profile.wallet.id },
          orderBy: { createdAt: "desc" },
          take: 12,
        }),
      ]);

    return {
      role: "USER" as const,
      selectedPeriod: {
        month: selectedRange.month,
        year: selectedRange.year,
        scope: period.scope || "month",
        revenue: selectedRevenue,
        tickets: selectedTickets,
        visits: selectedVisits,
      },
      previousPeriod: {
        month: previousPeriod.month,
        year: previousPeriod.year,
        revenue: previousRevenue,
        tickets: previousTickets,
        visits: previousVisits,
        canRequest: previousRevenue > 0 && !existingRequest,
        request: existingRequest ? formatWithdrawal(existingRequest) : null,
      },
      wallet: {
        balance: profile.wallet.balance,
        pending: profile.wallet.pending,
        totalEarned: profile.wallet.totalEarned,
      },
      withdrawals: withdrawals.map(formatWithdrawal),
    };
  }

  const dateFilter = { createdAt: { gte: selectedRange.start, lt: selectedRange.end } };
  const earningsDateFilter = { date: { gte: selectedRange.start, lt: selectedRange.end } };

  const [grossRevenue, promoterRevenue, tickets, visits, withdrawals, earningsByUser] = await Promise.all([
    sumGrossRevenue(earningsDateFilter),
    sumPromoterRevenue(earningsDateFilter),
    prisma.ticket.count({ where: dateFilter }),
    prisma.visit.count({ where: dateFilter }),
    prisma.withdrawal.findMany({
      include: {
        wallet: {
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.promoterDailyEarning.findMany({
      where: earningsDateFilter,
      select: {
        validVisits: true,
        tickets: true,
        grossRevenue: true,
        promoterShare: true,
        platformShare: true,
        profile: {
          select: {
            id: true,
            name: true,
            user: { select: { email: true } },
          },
        },
      },
    }),
  ]);

  const userMap = new Map<number, { id: number; name: string; email: string; revenue: number; grossRevenue: number; platformRevenue: number; tickets: number; visits: number }>();

  for (const earning of earningsByUser) {
    const profile = earning.profile;
    const current = userMap.get(profile.id) || {
      id: profile.id,
      name: profile.name,
      email: profile.user.email,
      revenue: 0,
      grossRevenue: 0,
      platformRevenue: 0,
      tickets: 0,
      visits: 0,
    };

    current.revenue += Number(earning.promoterShare || 0);
    current.grossRevenue += Number(earning.grossRevenue || 0);
    current.platformRevenue += Number(earning.platformShare || 0);
    current.tickets += earning.tickets;
    current.visits += earning.validVisits;
    userMap.set(profile.id, current);
  }

  return {
    role: "ADMIN" as const,
    selectedPeriod: {
      month: selectedRange.month,
      year: selectedRange.year,
      scope: period.scope || "month",
      grossRevenue,
      promoterRevenue,
      platformRevenue: grossRevenue - promoterRevenue,
      tickets,
      visits,
    },
    users: Array.from(userMap.values()).sort((a, b) => b.revenue - a.revenue),
    withdrawals: withdrawals.map(formatWithdrawal),
  };
}

export async function requestPreviousMonthPaymentAction(invoiceUrl: string) {
  const session = await getSession();

  if (!session || session.role !== "USER") {
    return { error: "Nao autorizado." };
  }

  if (!invoiceUrl || !invoiceUrl.toLowerCase().includes(".pdf")) {
    return { error: "Anexe a nota fiscal em PDF." };
  }

  const userId = Number(session.sub);
  const previousPeriod = getPreviousMonth();
  const previousRange = getPeriodRange({
    month: previousPeriod.month,
    year: previousPeriod.year,
    scope: "month",
  });

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { wallet: true },
  });

  if (!profile?.wallet) {
    return { error: "Carteira nao encontrada." };
  }

  const amount = await sumPromoterRevenue({
    date: { gte: previousRange.start, lt: previousRange.end },
    profileId: profile.id,
  });

  if (amount <= 0) {
    return { error: "Nao ha faturamento do mes anterior para solicitar pagamento." };
  }

  const existingRequest = await prisma.withdrawal.findFirst({
    where: {
      walletId: profile.wallet.id,
      referenceMonth: previousPeriod.month,
      referenceYear: previousPeriod.year,
    },
  });

  if (existingRequest) {
    return { error: "Ja existe uma solicitacao para este mes." };
  }

  await prisma.withdrawal.create({
    data: {
      amount,
      invoiceUrl,
      referenceMonth: previousPeriod.month,
      referenceYear: previousPeriod.year,
      walletId: profile.wallet.id,
      status: "PENDING",
    },
  });

  revalidatePath("/faturamento");
  return { success: true };
}

export async function markWithdrawalAsPaidAction(withdrawalId: number, receiptUrl: string) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { error: "Nao autorizado." };
  }

  if (!receiptUrl || !receiptUrl.toLowerCase().includes(".pdf")) {
    return { error: "Anexe o comprovante em PDF." };
  }

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
    include: {
      wallet: {
        select: { profileId: true },
      },
    },
  });

  if (!withdrawal) {
    return { error: "Solicitacao nao encontrada." };
  }

  if (withdrawal.status === "PAID") {
    return { error: "Esta solicitacao ja foi paga." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        receiptUrl,
        status: "PAID",
        paidAt: new Date(),
      },
    });

    if (withdrawal.referenceMonth && withdrawal.referenceYear) {
      const paidRange = getPeriodRange({
        month: withdrawal.referenceMonth,
        year: withdrawal.referenceYear,
        scope: "month",
      });

      await tx.promoterDailyEarning.updateMany({
        where: {
          profileId: withdrawal.wallet.profileId,
          date: { gte: paidRange.start, lt: paidRange.end },
        },
        data: { status: "PAID" },
      });
    }
  });

  revalidatePath("/faturamento");
  return { success: true };
}
