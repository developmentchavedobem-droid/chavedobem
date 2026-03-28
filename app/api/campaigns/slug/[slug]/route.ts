import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: {
        slug: slug,
      },
      include: {
        _count: {
          select: { tickets: true }, // Garante que o contador de pessoas venha junto
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}