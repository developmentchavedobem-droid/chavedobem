import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  fetchGoogleAdSenseDailyReport,
  syncDailyAdSenseReport,
  type DailyAdSenseReportInput,
} from "@/src/services/monetization.service";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const session = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string };
    return session.role === "ADMIN" ? session : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    let reportInput: DailyAdSenseReportInput;

    if (body.mode === "google") {
      const accessToken = body.accessToken || process.env.GOOGLE_ADSENSE_ACCESS_TOKEN;
      if (!accessToken) {
        return NextResponse.json({ error: "Informe um accessToken do Google AdSense." }, { status: 400 });
      }

      reportInput = await fetchGoogleAdSenseDailyReport({
        date: body.date,
        accessToken,
        account: body.account,
        sourceCurrency: body.sourceCurrency || body.currency,
      });
    } else {
      reportInput = {
        date: body.date,
        estimatedEarnings: Number(body.estimatedEarnings || 0),
        estimatedEarningsUsd: body.estimatedEarningsUsd === undefined ? undefined : Number(body.estimatedEarningsUsd || 0),
        exchangeRate: body.exchangeRate === undefined ? undefined : Number(body.exchangeRate || 0),
        exchangeRateDate: body.exchangeRateDate,
        exchangeRateSource: body.exchangeRateSource,
        pageViews: Number(body.pageViews || 0),
        clicks: Number(body.clicks || 0),
        impressions: Number(body.impressions || 0),
        pageViewsRpm: Number(body.pageViewsRpm || 0),
        currency: "BRL",
        sourceCurrency: body.sourceCurrency || body.currency || "USD",
        source: "manual",
        rawPayload: body,
      };
    }

    const result = await syncDailyAdSenseReport(reportInput);
    return NextResponse.json({
      success: true,
      allocation: result.allocation,
      report: {
        id: result.report.id,
        date: result.report.date,
        estimatedEarnings: result.report.estimatedEarnings,
        estimatedEarningsUsd: result.report.estimatedEarningsUsd,
        exchangeRate: result.report.exchangeRate,
        exchangeRateDate: result.report.exchangeRateDate,
        exchangeRateSource: result.report.exchangeRateSource,
        currency: result.report.currency,
        sourceCurrency: result.report.sourceCurrency,
        source: result.report.source,
      },
    });
  } catch (error: any) {
    console.error("Erro ao sincronizar monetizacao diaria:", error);
    return NextResponse.json({ error: error?.message || "Erro interno." }, { status: 500 });
  }
}
