"use client";

import { useEffect, useState } from "react";
import AppSidebar from "@/src/components/private/AppSidebar";
import AppTopbar from "@/src/components/private/AppTopbar";
import { useAuthStore } from "@/src/stores/auth.store";
import { useRouter } from "next/navigation";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === "CUSTOMER") {
      logout();
      router.push("/?error=acesso_negado");
    }
  }, [user, logout, router]);

  // 🛡️ TRAVA INSTANTÂNEA: 
  // Se o usuário for CUSTOMER, não renderizamos absolutamente nada.
  // Isso evita que o Sidebar, Topbar e o children apareçam enquanto o redirect não acontece.
  if (user?.role === "CUSTOMER") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {/* Opcional: Um loader minimalista para não parecer travado */}
        <div className="w-6 h-6 border-2 border-[#053B80] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Opcional: Bloqueia também se não houver usuário (evita flash enquanto o auth carrega)
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar
        userType={user?.role as "ADMIN" | "USER" | "CUSTOMER" | undefined}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={`
          flex-1 flex flex-col w-full min-h-screen transition-all duration-300
          lg:${collapsed ? "ml-20" : "ml-72"}
        `}
      >
        <AppTopbar
          userName={user?.profile?.name}
          userEmail={user?.email}
          onToggleSidebar={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
        />
        
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}