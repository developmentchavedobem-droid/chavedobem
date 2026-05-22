import { NextRequest, NextResponse } from "next/server";
import { ResendService } from "@/src/services/resend.service";

const mailService = new ResendService();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatorios." },
        { status: 400 }
      );
    }

    await mailService.sendEmail(
      "contato@chavedobem.com.br",
      `Contato pelo site: ${subject}`,
      `
        <h1>Nova mensagem pelo site Chave do Bem</h1>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no contato:", error);
    return NextResponse.json(
      { error: "Nao foi possivel enviar a mensagem agora." },
      { status: 500 }
    );
  }
}
