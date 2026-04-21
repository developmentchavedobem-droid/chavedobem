"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTimes, FaSignOutAlt } from "react-icons/fa"; // Adicionei o ícone de logout
import { PRIVATE_MODULES } from "@/src/constants/private-modules";
import Image from "next/image";
import { useAuthStore } from "@/src/stores/auth.store"; // Importe sua store

type Props = {
  userType?: "ADMIN" | "USER" | "CUSTOMER";
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function AppSidebar({
  userType,
  collapsed,
  mobileOpen,
  onCloseMobile
}: Props) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout); // Pegando a função de logout

  const modules = PRIVATE_MODULES.filter((item) =>
    userType ? item.roles.includes(userType) : false
  );

  return (
    <>
      {mobileOpen && (
        <button
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-gray-50 transition-all duration-300
          flex flex-col // Adicionado para permitir o uso de mt-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full rounded-2xl m-2"}
          lg:translate-x-0
          ${collapsed ? "lg:w-20" : "lg:w-70"}
          w-70 
        `}
      >
        {/* HEADER - LOGO */}
        <div className={`flex items-center justify-between ${mobileOpen ? 'h-20' : 'h-40'} px-4 shrink-0`}>
          <div className={`font-bold text-[#053B80] ${collapsed ? "lg:hidden" : "block mx-auto"}`}>
            <Image
              className="w-20 sm:w-72 md:w-40 h-auto"
              src="/logo.png"
              alt="ChaveDoBem logo"
              width={300}
              height={300}
              priority
            />
          </div>

          <button
            className="lg:hidden text-[#053B80]"
            onClick={onCloseMobile}
            aria-label="Fechar menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* NAVIGATION MODULES */}
        <nav className="flex flex-col gap-2 p-3 overflow-y-auto flex-1">
          {modules.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-3 transition
                  ${isActive ? "bg-[#053B80] text-white" : "text-[#053B80] hover:bg-[#053B80]/10"}
                  ${collapsed ? "lg:justify-center" : ""}
                `}
              >
                <Icon className="shrink-0" size={20} />
                <span className={`${collapsed ? "lg:hidden" : "block"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER - LOGOUT BUTTON */}
        <div className="p-3 border-t border-gray-200 mt-auto">
          <button
            onClick={() => {
              onCloseMobile();
              logout();
            }}
            className={`
              w-full flex items-center gap-3 rounded-xl px-3 py-3 transition
              text-red-600 hover:bg-red-50
              ${collapsed ? "lg:justify-center" : ""}
            `}
          >
            <FaSignOutAlt className="shrink-0" size={20} />
            <span className={`${collapsed ? "lg:hidden" : "block"} font-medium`}>
              Sair
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}