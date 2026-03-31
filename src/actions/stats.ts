'use server'

import prisma from "@/src/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getDashboardStatsAction(date: Date, month: Date) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.verify(token, process.env.JWT_SECRET!) as any) : null;

  if (!decoded) return { error: "Não autorizado" };

  const userId = Number(decoded.sub);
  const userRole = decoded.role; // Pegamos a role (ADMIN, CUSTOMER, etc)
  const isAdmin = userRole === "ADMIN";

  // 1. Busca cotação do Dólar
  let dollarRate = 0; 
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", { 
      next: { revalidate: 3600 } 
    });
    const data = await response.json();
    dollarRate = parseFloat(data.USDBRL.bid);
  } catch (e) { 
    console.error("Erro câmbio:", e); 
    dollarRate = 5.20; // Fallback caso a API falhe
  }

  const startOfDay = new Date(new Date(date).setHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date(date).setHours(23, 59, 59, 999));
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);

  try {
    // 2. Busca tickets do período
    const ticketsData = await prisma.ticket.findMany({
      where: {
        createdAt: { gte: startOfMonth, lte: endOfMonth },
        ...(isAdmin ? {} : { 
          referralLink: { 
            profile: { userId } 
          } 
        }) 
      },
      select: {
        createdAt: true,
        referralLinkId: true,
        campaign: {
          select: { ticketValue: true }
        }
      }
    });

    // 3. Definição do Multiplicador de Ganho
    // Se for ADMIN, ganha 100% (1). Se for divulgador, ganha 50% (0.5)
    const revenueMultiplier = isAdmin ? 1 : 0.5;

    let dailyRevenueBRL = 0;
    let monthlyTotalBRL = 0;
    const platformRevenueMap: Record<number, number> = {};

    ticketsData.forEach(ticket => {
      // Valor base em USD (ex: 0.05)
      const baseValUSD = Number(ticket.campaign.ticketValue || 0); 
      
      // Aplicamos a regra de metade do valor para divulgadores
      const finalValUSD = baseValUSD * revenueMultiplier;

      // Conversão para BRL usando a cotação atual
      const valBRL = finalValUSD * dollarRate;

      monthlyTotalBRL += valBRL;

      if (ticket.createdAt >= startOfDay && ticket.createdAt <= endOfDay) {
        dailyRevenueBRL += valBRL;
      }

      if (ticket.referralLinkId) {
        platformRevenueMap[ticket.referralLinkId] = (platformRevenueMap[ticket.referralLinkId] || 0) + valBRL;
      }
    });

    // 4. Busca estatísticas das plataformas
    const platformStats = await prisma.referralLink.findMany({
      where: isAdmin ? {} : { profile: { userId } },
      select: {
        id: true,
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

    return {
      dollarRate,
      dailyRevenueBRL,
      monthlyTotalBRL,
      platforms: platformStats.map(p => ({
        name: p.platform,
        code: p.code,
        visits: p._count.visits,
        tickets: p._count.tickets,
        revenueBRL: platformRevenueMap[p.id] || 0
      }))
    };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao buscar estatísticas" };
  }
}