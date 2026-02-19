"use client"

import Image from "next/image"
import Link from "next/link"
import './style.css'
import { FaAlignJustify } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function PublicHeader() {

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const darkLocalStorage = localStorage.getItem("darkMode");

    if (darkLocalStorage !== null) {
      const darkValue = darkLocalStorage === "true";
      const change = async () => setDark(darkValue);

      if (darkValue) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
  }, [dark]);

  function handleDarkMode() {
    const newValue = !dark;

    setDark(newValue);
    localStorage.setItem("darkMode", String(newValue));

    if (newValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
      <header className="w-full h-20 flex items-center justify-between bg-white px-10 fixed">
        <Image
          className=""
          src="/logo.svg"
          alt="ChaveDoBem logo"
          width={80}
          height={20}
          priority
        />
        <ul className="hidden sm:flex list-none gap-6">
          <li className="text-color-header">
            <Link href="/" className="font-bold">Início</Link>
          </li>
          <li className="text-color-header">
            <Link href="/" className="font-bold">Doações realizadas</Link>
          </li>
          <li className="text-color-header">
            <Link href="/" className="font-bold">Cadastre-se</Link>
          </li>
          <li className="text-color-header">
            <Link href="/" className="font-bold">Quem somos</Link>
          </li>
          <li className="text-color-header">
            <Link href="/" className="font-bold">Fale conosco</Link>
          </li>
        </ul>

        <div className="flex gap-4">
          {/* <button
            onClick={handleDarkMode}
            className="btn btn-neutral btn-outline btn-theme"
          >
            {dark ? "Modo Claro" : "Modo Escuro"}
          </button> */}

          <button className="btn btn-neutral btn-outline btn-theme">
            <Link href="/login" className="hidden sm:flex">
              Entrar
            </Link>
            <FaAlignJustify className="flex sm:hidden" />
          </button>
        </div>
      </header>
    )
}