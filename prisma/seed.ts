import prisma from '@/src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Iniciando seed...')

  // 1. Verificar se o admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@admin.com' }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('administrador', 10)

    // 2. Criar o Usuário e o Profile (com a Wallet dentro dele)
    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashedPassword,
        role: 'ADMIN', 
        profile: {
          create: {
            name: 'Administrador',
            // A Wallet pertence ao Profile, então criamos aqui:
            wallet: { 
              create: {} 
            }
          }
        }
      }
    })

    console.log('✅ Usuário Admin, Profile e Wallet criados com sucesso')
  } else {
    console.log('ℹ️ Admin já existe no banco de dados')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })