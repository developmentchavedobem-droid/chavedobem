import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import jwt, { JwtPayload } from 'jsonwebtoken'

// 1. Tipagem alinhada com o novo Schema (usando role em vez de type)
type TokenPayload = JwtPayload & {
  sub: string
  email: string
  role: string 
}

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Retorna os dados completos do usuário autenticado
 * description: Lê o cookie "token", valida o JWT e busca os dados do User, Profile e Wallet no banco.
 * tags: [Auth]
 * responses:
 * 200:
 * description: Usuário retornado com sucesso
 * 401:
 * description: Token inválido ou ausente
 * 404:
 * description: Usuário não encontrado no banco
 */

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // 2. Verificação do JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )

    const payload = decoded as TokenPayload

    // 3. Busca no banco incluindo as novas relações
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: {
        id: true,
        email: true,
        role: true, // Alterado de 'type'
        profile: {
          include: {
            wallet: true // Fundamental para o Dashboard do Divulgador (USER)
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // 4. Retorno formatado para a sua AuthStore do Zustand
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    )
  }
}