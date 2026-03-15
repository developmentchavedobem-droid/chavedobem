import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/src/lib/prisma";

type TokenPayload = JwtPayload & {
  sub: number;
  email: string;
  type: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decoded === "string") {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const payload = decoded as TokenPayload;
    const createdById = Number(payload.sub);

    if (!createdById) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const goal = Number(body.goal);

    if (!name || !goal || goal <= 0) {
      return NextResponse.json(
        { error: "Preencha nome e uma meta válida" },
        { status: 400 }
      );
    }

    if (imageUrl) {
      try {
        new URL(imageUrl);
      } catch {
        return NextResponse.json(
          { error: "Informe uma URL de imagem válida" },
          { status: 400 }
        );
      }
    }

    const baseSlug = slugify(name);
    const slugPrefix = baseSlug || `campanha-${Date.now()}`;

    const existingCampaigns = await prisma.campaign.findMany({
      where: {
        slug: {
          startsWith: slugPrefix,
        },
      },
      select: {
        slug: true,
      },
    });

    const existingSlugs = new Set(existingCampaigns.map((campaign) => campaign.slug));
    let slug = slugPrefix;
    let counter = 2;

    while (existingSlugs.has(slug)) {
      slug = `${slugPrefix}-${counter}`;
      counter += 1;
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        slug,
        description: description || null,
        imageUrl: imageUrl || null,
        goal,
        createdById,
      },
    });

    revalidatePath("/campanhas");

    return NextResponse.json(campaign, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar campanha" },
      { status: 500 }
    );
  }
}
