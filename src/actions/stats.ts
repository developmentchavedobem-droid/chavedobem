'use server'

import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getDashboardStatsAction(date: Date, month: Date) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.verify(token, process.env.JWT_SECRET!) as any) : null;

  if (!decoded) return { error: "Não autorizado" };

  const userId = decoded.sub;
  const isAdmin = decoded.role === "ADMIN";

  // Busca cotação do Dólar (AwesomeAPI)
  let dollarRate = 5.17; // fallback
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", { next: { revalidate: 3600 } });
    const data = await response.json();
    dollarRate = parseFloat(data.USDBRL.bid);
  } catch (e) {
    console.error("Erro ao buscar cotação:", e);
  }

  const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

  try {
    const dailyTickets = await prisma.ticket.count({
      where: {
        createdAt: { gte: startOfDay, lte: endOfDay },
        ...(isAdmin ? {} : { profile: { userId: Number(userId) } })
      }
    });

    const monthlyTickets = await prisma.ticket.count({
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth },
        ...(isAdmin ? {} : { profile: { userId: Number(userId) } })
      }
    });

    const platformStats = await prisma.referralLink.findMany({
      where: isAdmin ? {} : { profile: { userId: Number(userId) } },
      select: {
        platform: true,
        code: true,
        _count: {
          select: { 
            tickets: { where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } },
            visits: true 
          }
        }
      }
    });

    const ticketValueBRL = 0.50; // Valor fixo por ticket em Reais

    return {
      dollarRate,
      dailyRevenueBRL: dailyTickets * ticketValueBRL,
      monthlyTotalBRL: monthlyTickets * ticketValueBRL,
      platforms: platformStats.map(p => ({
        name: p.platform,
        code: p.code,
        visits: p._count.visits,
        tickets: p._count.tickets,
        revenueBRL: p._count.tickets * ticketValueBRL
      }))
    };
  } catch (error) {
    return { error: "Erro ao buscar estatísticas" };
  }
}