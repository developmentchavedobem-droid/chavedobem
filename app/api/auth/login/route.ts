import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Realiza login do usuário
 * description: Autentica o usuário, gera um JWT contendo a Role e define um cookie seguro.
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * example: admin@admin.com
 * password:
 * type: string
 * example: administrador
 * responses:
 * 200:
 * description: Login realizado com sucesso. Retorna dados do usuário e do perfil.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * user:
 * type: object
 * properties:
 * id:
 * type: integer
 * email:
 * type: string
 * role:
 * type: string
 * enum: [ADMIN, USER, CUSTOMER]
 * 401:
 * description: Credenciais inválidas (E-mail não encontrado ou senha incorreta).
 * 500:
 * description: Erro interno no servidor.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 1. Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            wallet: true 
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    // --- NOVA TRAVA DE SEGURANÇA ---
    if (user.role === "CUSTOMER") {
      return NextResponse.json(
        { error: "Acesso negado. Clientes não possuem acesso ao painel administrativo." },
        { status: 403 } // Forbidden
      );
    }
    // -------------------------------

    // 2. Validação da senha com Bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email ou senha inválidos" },
        { status: 401 }
      );
    }

    // 3. Geração do Token JWT (Payload agora contém 'role' para o Middleware)
    const token = jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
        role: user.role // Campo crucial para a autorização de rotas
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 4. Preparação da resposta
    const response = NextResponse.json(
      {
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      },
      { status: 200 }
    );

    // 5. Configuração do Cookie HTTP-Only
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 }
    );
  }
}