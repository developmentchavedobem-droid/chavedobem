import { Suspense } from "react";
import UserTabs from "@/src/components/admin/UserTabs";
import CreateUserModal from "@/src/components/admin/CreateUserModal";
import prisma from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tab?: string }>;
}) {
  const { page = "1", tab = "system" } = await searchParams;

  // 1. Verificação de Segurança (Role Admin)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? (jwt.decode(token) as any) : null;

  if (!decoded || decoded.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 2. Parâmetros de Busca/Paginação
  const currentPage = Math.max(Number(page), 1);
  const pageSize = 10;

  // Busca Usuários de Sistema (ADMIN e USER)
  const systemUsers = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "USER"] } },
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  });

  // Busca Customers com Paginação
  const [customers, totalCustomers] = await prisma.$transaction([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: { profile: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
  ]);

  return (
    <div className="flex w-full items-end flex-col gap-4 overflow-x-hidden px-3 pb-4 sm:px-4 lg:px-0">
      {/* Container principal ocupando 80% na web para dar espaço ao menu lateral */}
      <div className="flex w-full max-w-full flex-col gap-3 rounded-2xl bg-gray-100 p-4 lg:w-[80%]">
        
        {/* Header alinhado com o padrão da página de Campanhas */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[#026D9B]">Gestão de Usuários</h1>
            <p className="text-sm text-gray-600">
              Gerencie permissões da equipe e visualize a base de clientes do sistema.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            {/* O Modal já deve conter o botão estilizado internamente */}
            <CreateUserModal />
          </div>
        </div>

        {/* Listagem e Tabs */}
        <div className="w-full">
          <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white rounded-2xl" />}>
            <UserTabs 
              systemUsers={systemUsers} 
              customers={customers} 
              totalCustomers={totalCustomers}
              currentPage={currentPage}
              pageSize={pageSize}
              activeTab={tab}
            />
          </Suspense>
        </div>

      </div>
    </div>
  );
}