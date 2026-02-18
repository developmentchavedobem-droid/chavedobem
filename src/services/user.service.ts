import prisma from '@/src/lib/prisma'
import { UserType } from '@prisma/client'
import bcrypt from 'bcryptjs'

export async function createUser(data: {
  email: string
  password: string
  type: UserType
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      type: data.type
    }
  })
}
