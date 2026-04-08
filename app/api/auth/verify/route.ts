import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) return NextResponse.redirect(new URL("/?verify=error", request.url));

  try {
    const vToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!vToken || vToken.expiresAt < new Date()) {
      return NextResponse.redirect(new URL("/?verify=expired", request.url));
    }

    // Marca o e-mail como verificado
    await prisma.user.update({
      where: { email: vToken.identifier },
      data: { emailVerified: new Date() }
    });

    // Limpa o token usado
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.redirect(new URL("/?verify=success", request.url));
  } catch (e) {
    return NextResponse.redirect(new URL("/?verify=server_error", request.url));
  }
}