"use client";

import { useState } from "react";
import AppSidebar from "@/src/components/private/AppSidebar";
import AppTopbar from "@/src/components/private/AppTopbar";
import { useAuthStore } from "@/src/stores/auth.store";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          lg:${collapsed ? "ml-20" : "ml-70"}
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