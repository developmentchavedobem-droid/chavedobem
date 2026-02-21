import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prismaClientSingleton = () =>
  new PrismaClient({
    adapter
  })

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma =
  global.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma
}
