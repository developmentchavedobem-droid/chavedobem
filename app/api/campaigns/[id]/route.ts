import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/src/lib/prisma";
import { sanitizeCampaignHtml } from "@/src/utils/html-content";

/**
 * @swagger
 * /api/campaigns/{id}:
 *   put:
 *     summary: Edita uma campanha existente
 *     description: Atualiza os dados editáveis de uma campanha pelo ID
 *     tags: [Campaigns]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da campanha
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Campanha Pix 5 Mil
 *               goal:
 *                 type: number
 *                 example: 5000
 *               description:
 *                 type: string
 *                 example: Nova descrição da campanha
 *               imageUrl:
 *                 type: string
 *                 example: https://meusite.com/imagens/nova-campanha.jpg
 *               ticketValue:
 *                 type: number
 *                 example: 2
 *               ticketGoal:
 *                 type: number
 *                 example: 2500
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao editar campanha
 *   delete:
 *     summary: Deleta uma campanha
 *     description: Remove uma campanha existente pelo ID
 *     tags: [Campaigns]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da campanha
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Campanha deletada com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro ao deletar campanha
 */

function revalidateCampaignViews(slug?: string) {
  revalidatePath("/");
  revalidatePath("/sorteios");
  revalidatePath("/cadastre-se");
  revalidatePath("/doacoes");
  revalidatePath("/campanhas");

  if (!slug) return;

  revalidatePath(`/campanha/${slug}`);
  revalidatePath(`/campanha/${slug}/descricao`);
  revalidatePath(`/campanha/${slug}/instrucoes`);
  revalidatePath(`/campanha/${slug}/tutorial`);
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    // CORREÇÃO CRÍTICA: Aguardar o params
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    
    const body = await req.json();
    const currentCampaign = await prisma.campaign.findUnique({
      where: { id },
      select: { slug: true },
    });

    // Removemos campos que não devem ser editados manualmente
    const updateData = { ...body };
    delete updateData.id;
    delete updateData.slug;
    delete updateData.createdAt;
    delete updateData.ticketValue;
    delete updateData.currentAmount;
    delete updateData.currentTickets;

    if (typeof updateData.description === "string") {
      updateData.description = sanitizeCampaignHtml(updateData.description);
    }
    if (typeof updateData.secondDescription === "string") {
      updateData.secondDescription = sanitizeCampaignHtml(updateData.secondDescription);
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...updateData,
        // Garante conversão numérica para o banco
        goal: updateData.goal ? Number(updateData.goal) : undefined,
        ticketGoal: updateData.ticketGoal ? Number(updateData.ticketGoal) : undefined,
      },
    });

    revalidateCampaignViews(updatedCampaign.slug || currentCampaign?.slug);

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error("Erro no PUT /api/campaigns/[id]:", error);
    return NextResponse.json({ error: "Erro ao editar campanha" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    // CORREÇÃO CRÍTICA: Aguardar o params
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.campaign.delete({
      where: { id },
    });

    revalidateCampaignViews(campaign?.slug);

    return NextResponse.json({ message: "Campanha deletada com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE /api/campaigns/[id]:", error);
    return NextResponse.json({ error: "Erro ao deletar campanha" }, { status: 500 });
  }
}
