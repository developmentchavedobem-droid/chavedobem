"use client"

import Image from "next/image"
import Link from "next/link"
import { FaAlignJustify } from "react-icons/fa"
import { useEffect, useState } from "react"
import "./style.css"

export default function PublicHeader() {

  const [dark, setDark] = useState(false)

  useEffect(() => {
    // const darkLocalStorage = localStorage.getItem("darkMode")

    // if (darkLocalStorage !== null) {
    //   const darkValue = darkLocalStorage === "true"
    //   async() => setDark(darkValue)

    //   if (darkValue) {
    //     document.documentElement.classList.add("dark")
    //   } else {
    //     document.documentElement.classList.remove("dark")
    //   }
    // }
  }, [])

  function handleDarkMode() {
    const newValue = !dark

    setDark(newValue)
    localStorage.setItem("darkMode", String(newValue))

    if (newValue) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="drawer drawer-end">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <header className="w-full h-20 flex items-center justify-between bg-white dark:bg-neutral-900 px-6 sm:px-10 fixed z-10 shadow">
          
          <Image
            src="/logo.svg"
            alt="ChaveDoBem logo"
            width={80}
            height={20}
            priority
          />

          {/* Menu Desktop */}
          <ul className="hidden sm:flex list-none gap-6 text-color-header">
            <li><Link href="/" className="font-bold">Início</Link></li>
            <li><Link href="/doacoes" className="font-bold">Doações realizadas</Link></li>
            <li><Link href="/cadastre-se" className="font-bold">Cadastre-se</Link></li>
            <li><Link href="/quem-somos" className="font-bold">Quem somos</Link></li>
            <li><Link href="/fale-conosco" className="font-bold">Fale conosco</Link></li>
          </ul>

          <div className="flex gap-4 items-center">
            
            {/* Botão Dark Mode (opcional) */}
            {/* 
            <button
              onClick={handleDarkMode}
              className="btn btn-neutral btn-outline"
            >
              {dark ? "Modo Claro" : "Modo Escuro"}
            </button> 
            */}

            {/* Botão Login Desktop */}
            <Link
              href="/login"
              className="hidden sm:flex btn btn-neutral btn-outline btn-theme"
            >
              Entrar
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
          <li><Link href="/">Início</Link></li>
          <li><Link href="/doacoes">Doações realizadas</Link></li>
          <li><Link href="/cadastre-se">Cadastre-se</Link></li>
          <li><Link href="/quem-somos">Quem somos</Link></li>
          <li><Link href="/fale-conosco">Fale conosco</Link></li>
          <li className="pt-4">
            <Link href="/login" className="btn btn-neutral w-full btn-theme">
              Entrar
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}