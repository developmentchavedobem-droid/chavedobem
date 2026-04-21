import { NextResponse } from "next/server";
import { syncRecentAdSenseReports } from "@/src/services/monetization.service";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  const authorization = request.headers.get("authorization");
  const querySecret = new URL(request.url).searchParams.get("secret");

  return authorization === `Bearer ${cronSecret}` || querySecret === cronSecret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const lookback = Number(new URL(request.url).searchParams.get("days") || 0) || undefined;
    const result = await syncRecentAdSenseReports({
      trigger: request.headers.get("user-agent")?.includes("vercel-cron") ? "vercel-cron" : "manual",
      lookbackDays: lookback,
    });

    return NextResponse.json({
      success: true,
      logId: result.log.id,
      synced: result.synced,
    });
  } catch (error: any) {
    console.error("Erro no cron do AdSense:", error);
    return NextResponse.json(
      {
        success: false,
        logId: error?.cronLog?.id,
        error: error?.message || "Erro ao sincronizar AdSense.",
      },
      { status: 500 }
    );
  }
}
