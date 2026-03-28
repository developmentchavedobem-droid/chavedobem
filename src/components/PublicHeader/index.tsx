"use client"

import Image from "next/image"
import Link from "next/link"
import { FaAlignJustify } from "react-icons/fa"
import { useRef } from "react"
import "./style.css"
import { useAuthStore } from "@/src/stores/auth.store";

export default function PublicHeader() {
  const user = useAuthStore((state) => state.user);
  const drawerRef = useRef<HTMLInputElement>(null)

  function closeDrawer() {
    if (drawerRef.current) {
      drawerRef.current.checked = false
    }
  }

  return (
    <div className="drawer drawer-end">
      <input
        ref={drawerRef}
        id="mobile-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content">
        <header className="w-full h-20 flex items-center justify-between bg-white dark:bg-neutral-900 px-6 sm:px-10 fixed z-10 shadow">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="ChaveDoBem logo"
              width={80}
              height={20}
              priority
            />
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden sm:flex list-none gap-6 text-color-header">
            <li><Link href="/" className="font-bold">Início</Link></li>
            {/* <li><Link href="/doacoes" className="font-bold">Doações realizadas</Link></li> */}
            <li><Link href="/cadastre-se" className="font-bold">Cadastre-se</Link></li>
            <li><Link href="/quem-somos" className="font-bold">Quem somos</Link></li>
            <li><Link href="/fale-conosco" className="font-bold">Fale conosco</Link></li>
          </ul>

          <div className="flex gap-4 items-center">
            <Link
              href={user ? "/home" : "/login"}
              className="hidden sm:flex btn btn-neutral btn-outline btn-theme"
            >
              {user ? 'Minha conta' : 'Entrar'}
            </Link>

            {/* Botão Hamburguer Mobile */}
            <label
              htmlFor="mobile-drawer"
              className="btn btn-neutral btn-outline sm:hidden btn-theme"
            >
              <FaAlignJustify />
            </label>
          </div>
        </header>
      </div>

      {/* Drawer Mobile */}
      <div className="drawer-side z-20">
        <label
          htmlFor="mobile-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-white dark:bg-neutral-900 min-h-full w-72 p-6 space-y-2 text-lg text-color-header">
          <li><Link href="/" onClick={closeDrawer}>Início</Link></li>
          {/* <li><Link href="/doacoes" onClick={closeDrawer}>Doações realizadas</Link></li> */}
          <li><Link href="/cadastre-se" onClick={closeDrawer}>Cadastre-se</Link></li>
          <li><Link href="/quem-somos" onClick={closeDrawer}>Quem somos</Link></li>
          <li><Link href="/fale-conosco" onClick={closeDrawer}>Fale conosco</Link></li>
          <li className="pt-4">
            <Link
              href="/login"
              onClick={closeDrawer}
              className="btn btn-neutral w-full btn-theme"
            >
              Entrar
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}