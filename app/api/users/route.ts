import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true
      }
    })

    return NextResponse.json(users)
  } catch {
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    )
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
