import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import jwt from "jsonwebtoken";
import slugify from "slugify";

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Lista todas as campanhas
 *     description: Retorna todas as campanhas ordenadas por data de criação decrescente
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso
 *       500:
 *         description: Erro ao buscar campanhas
 *   post:
 *     summary: Cria uma nova campanha
 *     description: Cria uma nova campanha autenticada com base nos dados enviados no corpo da requisição
 *     tags: [Campaigns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - goal
 *             properties:
 *               name:
 *                 type: string
 *                 example: Campanha Pix 10 Mil
 *               goal:
 *                 type: number
 *                 example: 10000
 *               description:
 *                 type: string
 *                 example: Campanha promocional para distribuição de prêmio
 *               imageUrl:
 *                 type: string
 *                 example: https://meusite.com/imagens/campanha.jpg
 *               ticketValue:
 *                 type: number
 *                 example: 1
 *               ticketGoal:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao criar campanha
 */

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar campanhas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    const { name, goal, description, imageUrl, ticketValue, ticketGoal } = await req.json();

    const slug = slugify(name, { lower: true, strict: true }) + "-" + Math.floor(Math.random() * 1000);

    const campaign = await prisma.campaign.create({
      data: {
        name,
        slug,
        goal,
        description,
        imageUrl,
        ticketValue: ticketValue || 0,
        ticketGoal: ticketGoal || 0,
        createdById: Number(decoded.sub),
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar campanha" }, { status: 500 });
  }
}