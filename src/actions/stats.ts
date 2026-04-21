"use server";

import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function reportDateKey(date: Date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().slice(0, 10);
}

async function sumRevenue(where: any, field: "grossRevenue" | "promoterShare") {
  const rows = await prisma.promoterDailyEarning.findMany({
    where,
    select: { [field]: true },
  });

  return rows.reduce((total, row: any) => total + Number(row[field] || 0), 0);
}

export async function getDashboardStatsAction(date: Date, month: Date) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.verify(token, process.env.JWT_SECRET!) as any) : null;

  if (!decoded) return { error: "Nao autorizado" };

  const userId = Number(decoded.sub);
  const isAdmin = decoded.role === "ADMIN";
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const dayReportDate = new Date(`${reportDateKey(date)}T00:00:00.000Z`);

  try {
    const profile = isAdmin
      ? null
      : await prisma.profile.findUnique({
          where: { userId },
          select: { id: true },
        });

    const revenueField = isAdmin ? "grossRevenue" : "promoterShare";
    const revenueProfileFilter = isAdmin ? {} : { profileId: profile?.id || 0 };

    const [dailyRevenueBRL, monthlyTotalBRL, platformStats, visitsForRevenue, dailyReport] = await Promise.all([
      sumRevenue({ date: dayReportDate, ...revenueProfileFilter }, revenueField),
      sumRevenue({ date: { gte: monthStart, lte: monthEnd }, ...revenueProfileFilter }, revenueField),
      prisma.referralLink.findMany({
        where: isAdmin ? {} : { profile: { userId } },
        select: {
          id: true,
          platform: true,
          code: true,
          _count: {
            select: {
              tickets: { where: { createdAt: { gte: monthStart, lte: monthEnd } } },
              visits: { where: { createdAt: { gte: monthStart, lte: monthEnd } } },
            },
          },
        },
      }),
      prisma.visit.findMany({
        where: {
          createdAt: { gte: monthStart, lte: monthEnd },
          ...(isAdmin ? {} : { referral: { profile: { userId } } }),
        },
        select: {
          referralId: true,
          createdAt: true,
        },
      }),
      prisma.adSenseDailyReport.findUnique({
        where: { date: dayReportDate },
        select: {
          estimatedEarnings: true,
          estimatedEarningsUsd: true,
          exchangeRate: true,
          exchangeRateDate: true,
          exchangeRateSource: true,
          currency: true,
          sourceCurrency: true,
          pageViews: true,
          clicks: true,
          impressions: true,
          pageViewsRpm: true,
        },
      }),
    ]);

    const reports = await prisma.adSenseDailyReport.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
      select: { date: true, estimatedEarnings: true },
    });
    const visitsByDay = await prisma.visit.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: monthStart, lte: monthEnd } },
      _count: { _all: true },
    });
    const totalVisitsByDay = new Map<string, number>();

    for (const row of visitsByDay) {
      const key = reportDateKey(row.createdAt);
      totalVisitsByDay.set(key, (totalVisitsByDay.get(key) || 0) + row._count._all);
    }

    const reportRevenueByDay = new Map(reports.map((report) => [report.date.toISOString().slice(0, 10), Number(report.estimatedEarnings || 0)]));
    const revenueByReferral = new Map<number, number>();

    for (const visit of visitsForRevenue) {
      const key = reportDateKey(visit.createdAt);
      const dailyVisits = totalVisitsByDay.get(key) || 0;
      const dailyRevenue = reportRevenueByDay.get(key) || 0;
      const value = dailyVisits > 0 ? dailyRevenue / dailyVisits : 0;
      revenueByReferral.set(visit.referralId, (revenueByReferral.get(visit.referralId) || 0) + value * (isAdmin ? 1 : 0.5));
    }

    return {
      dailyRevenueBRL,
      monthlyTotalBRL,
      dailyReport: {
        estimatedEarnings: Number(dailyReport?.estimatedEarnings || 0),
        estimatedEarningsUsd: Number(dailyReport?.estimatedEarningsUsd || 0),
        exchangeRate: Number(dailyReport?.exchangeRate || 0),
        exchangeRateDate: dailyReport?.exchangeRateDate?.toISOString() || null,
        exchangeRateSource: dailyReport?.exchangeRateSource || null,
        currency: dailyReport?.currency || "BRL",
        sourceCurrency: dailyReport?.sourceCurrency || "USD",
        pageViews: dailyReport?.pageViews || 0,
        clicks: dailyReport?.clicks || 0,
        impressions: dailyReport?.impressions || 0,
        pageViewsRpm: Number(dailyReport?.pageViewsRpm || 0),
      },
      platforms: platformStats.map((p) => ({
        name: p.platform,
        code: p.code,
        visits: p._count.visits,
        tickets: p._count.tickets,
        revenueBRL: revenueByReferral.get(p.id) || 0,
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao buscar estatisticas" };
  }
}
