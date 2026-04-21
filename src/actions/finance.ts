"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/src/lib/prisma";
import { s3Client } from "@/src/lib/s3";

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

const USER_REVENUE_SHARE = 0.5;

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

async function sumTicketRevenue(where: any, share = 1) {
  const tickets = await prisma.ticket.findMany({
    where,
    select: {
      campaign: {
        select: {
          ticketValue: true,
        },
      },
    },
  });

  return tickets.reduce((total, ticket) => {
    return total + Number(ticket.campaign.ticketValue || 0) * share;
  }, 0);
}

export async function getFinanceUploadUrl(fileName: string, fileType: string, kind: "invoice" | "receipt") {
  const session = await getSession();

  if (!session || !["ADMIN", "USER"].includes(session.role)) {
    return { error: "Nao autorizado." };
  }

  if (fileType !== "application/pdf") {
    return { error: "Envie um arquivo PDF." };
  }

  const fileExtension = fileName.split(".").pop() || "pdf";
  const key = `finance/${kind === "invoice" ? "notas-fiscais" : "comprovantes"}/${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
      signableHeaders: new Set(["host"]),
    });

    const cleanUrl = uploadUrl
      .split("&")
      .filter((param) => !param.includes("x-amz-checksum") && !param.includes("x-amz-sdk-checksum"))
      .join("&");

    return {
      success: true,
      uploadUrl: cleanUrl,
      publicUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error("Erro ao preparar upload financeiro:", error);
    return { error: "Falha ao preparar upload." };
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

    const previousWhere = {
      createdAt: { gte: previousRange.start, lt: previousRange.end },
      referralLink: { profileId: profile.id },
    };

    const selectedWhere = {
      createdAt: { gte: selectedRange.start, lt: selectedRange.end },
      referralLink: { profileId: profile.id },
    };

    const [previousRevenue, selectedRevenue, previousTickets, selectedTickets, previousVisits, selectedVisits, existingRequest, withdrawals] =
      await Promise.all([
        sumTicketRevenue(previousWhere, USER_REVENUE_SHARE),
        sumTicketRevenue(selectedWhere, USER_REVENUE_SHARE),
        prisma.ticket.count({ where: previousWhere }),
        prisma.ticket.count({ where: selectedWhere }),
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

  const [grossRevenue, tickets, visits, withdrawals, ticketsByUser, visitsByUser] = await Promise.all([
    sumTicketRevenue(dateFilter, 1),
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
    prisma.ticket.findMany({
      where: {
        ...dateFilter,
        referralLinkId: { not: null },
      },
      select: {
        campaign: { select: { ticketValue: true } },
        referralLink: {
          select: {
            profile: {
              select: {
                id: true,
                name: true,
                user: { select: { email: true } },
              },
            },
          },
        },
      },
    }),
    prisma.visit.findMany({
      where: dateFilter,
      select: {
        referral: {
          select: {
            profile: {
              select: {
                id: true,
                name: true,
                user: { select: { email: true } },
              },
            },
          },
        },
      },
    }),
  ]);

  const userMap = new Map<number, { id: number; name: string; email: string; revenue: number; tickets: number; visits: number }>();

  for (const ticket of ticketsByUser) {
    const profile = ticket.referralLink?.profile;
    if (!profile) continue;

    const current = userMap.get(profile.id) || {
      id: profile.id,
      name: profile.name,
      email: profile.user.email,
      revenue: 0,
      tickets: 0,
      visits: 0,
    };

    current.revenue += Number(ticket.campaign.ticketValue || 0) * USER_REVENUE_SHARE;
    current.tickets += 1;
    userMap.set(profile.id, current);
  }

  for (const visit of visitsByUser) {
    const profile = visit.referral.profile;
    const current = userMap.get(profile.id) || {
      id: profile.id,
      name: profile.name,
      email: profile.user.email,
      revenue: 0,
      tickets: 0,
      visits: 0,
    };

    current.visits += 1;
    userMap.set(profile.id, current);
  }

  return {
    role: "ADMIN" as const,
    selectedPeriod: {
      month: selectedRange.month,
      year: selectedRange.year,
      scope: period.scope || "month",
      grossRevenue,
      promoterRevenue: grossRevenue * USER_REVENUE_SHARE,
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

  const amount = await sumTicketRevenue(
    {
      createdAt: { gte: previousRange.start, lt: previousRange.end },
      referralLink: { profileId: profile.id },
    },
    USER_REVENUE_SHARE
  );

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
  });

  if (!withdrawal) {
    return { error: "Solicitacao nao encontrada." };
  }

  if (withdrawal.status === "PAID") {
    return { error: "Esta solicitacao ja foi paga." };
  }

  await prisma.withdrawal.update({
    where: { id: withdrawalId },
    data: {
      receiptUrl,
      status: "PAID",
      paidAt: new Date(),
    },
  });

  revalidatePath("/faturamento");
  return { success: true };
}
