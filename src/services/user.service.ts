import prisma from '@/src/lib/prisma'
import { Role } from '@/app/generated/prisma/client'
import bcrypt from 'bcryptjs'

export async function createUser(data: {
  email: string
  password: string
  role: Role
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role
    }
  })
}
