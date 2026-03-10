import prisma from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {

  // Criar roles
  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'user' },
      { name: 'customer' }
    ],
    skipDuplicates: true
  })

  // Buscar role admin
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  })

  if (!adminRole) {
    throw new Error('Role admin não encontrada')
  }

  // Verificar se admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' }
  })

  if (!existingAdmin) {

    const hashedPassword = await bcrypt.hash('administrador', 10)

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashedPassword,
        type: 'ADMIN'
      }
    })

    await prisma.profile.create({
      data: {
        name: 'Administrador',
        userId: adminUser.id,
        roleId: adminRole.id
      }
    })

    console.log('Admin criado com sucesso')
  } else {
    console.log('Admin já existe')
  }
}

main()
  .then(() => {
    console.log('Seed executado com sucesso')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })