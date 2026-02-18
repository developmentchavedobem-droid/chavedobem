// import { PrismaClient } from '@/app/generated/prisma/client'

// const prisma = new PrismaClient()

// async function main() {
//   await prisma.role.createMany({
//     data: [
//       { name: 'admin' },
//       { name: 'user' },
//       { name: 'customer' }
//     ],
//     skipDuplicates: true
//   })
// }

// main()
//   .then(() => {
//     console.log('Roles criadas com sucesso')
//   })
//   .catch((e) => {
//     console.error(e)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
