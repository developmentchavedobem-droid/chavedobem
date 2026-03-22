import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";
import slugify from "slugify";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    const { name, goal, description, imageUrl } = await req.json();

    // Gerar Slug amigável
    const slug = slugify(name, { lower: true, strict: true }) + "-" + Math.floor(Math.random() * 1000);

    const campaign = await prisma.campaign.create({
      data: {
        name,
        slug,
        goal,
        description,
        imageUrl,
        createdById: Number(decoded.sub), // Vincula ao Admin logado
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar campanha" }, { status: 500 });
  }
}