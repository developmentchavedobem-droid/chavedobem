import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

const AD_PAGES = new Set(["campaign", "instructions", "tutorial"]);
const VISIT_COOLDOWN_MS = 3 * 60 * 60 * 1000;

function getCookie(request: Request, name: string) {
  const cookies = request.headers.get("cookie") || "";
  const value = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return value ? decodeURIComponent(value) : null;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();

  return forwardedFor || realIp || cloudflareIp || "unknown";
}

export async function POST(request: Request) {
  try {
    const { slug, ref, page } = await request.json();
    const refCode = ref || getCookie(request, "chave_ref");

    if (!slug || !refCode || !AD_PAGES.has(page)) {
      return NextResponse.json({ tracked: false }, { status: 400 });
    }

    const [campaign, referral] = await Promise.all([
      prisma.campaign.findUnique({
        where: { slug },
        select: { id: true, status: true },
      }),
      prisma.referralLink.findUnique({
        where: { code: refCode },
        select: { id: true },
      }),
    ]);

    if (!campaign || campaign.status !== "ACTIVE" || !referral) {
      return NextResponse.json({ tracked: false }, { status: 404 });
    }

    const ip = getClientIp(request);
    const threeHoursAgo = new Date(Date.now() - VISIT_COOLDOWN_MS);

    const existingVisit = await prisma.visit.findFirst({
      where: {
        referralId: referral.id,
        campaignId: campaign.id,
        page,
        ip,
        createdAt: { gte: threeHoursAgo },
      },
      select: { id: true },
    });

    if (existingVisit) {
      return NextResponse.json({ tracked: false, reason: "cooldown" });
    }

    await prisma.visit.create({
      data: {
        referralId: referral.id,
        campaignId: campaign.id,
        page,
        ip,
        userAgent: request.headers.get("user-agent"),
      },
    });

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Erro ao registrar visita:", error);
    return NextResponse.json({ tracked: false, error: "Erro interno" }, { status: 500 });
  }
}
