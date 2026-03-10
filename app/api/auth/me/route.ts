import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/prisma'
import jwt, { JwtPayload } from 'jsonwebtoken'

type TokenPayload = JwtPayload & {
  sub: number
  email: string
  type: string
}

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuário autenticado
 *       401:
 *         description: Não autenticado
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )

    if (typeof decoded === 'string') {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const payload = decoded as TokenPayload

    if (!payload.sub || !payload.email || !payload.type) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      include: {
        profile: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      type: user.type,
      profile: user.profile
    })
  } catch {
    return NextResponse.json(
      { error: 'Token inválido ou expirado' },
      { status: 401 }
    )
  }
}