"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { useAuthStore } from "@/src/stores/auth.store";
import "./style.css";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/cadastre-se", label: "Cadastre-se" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/fale-conosco", label: "Fale conosco" },
  { href: "/politica-privacidade", label: "Privacidade" },
  { href: "/termos-uso", label: "Termos" },
];

export default function PublicHeader() {
  const user = useAuthStore((state) => state.user);
  const drawerRef = useRef<HTMLInputElement>(null);

  function closeDrawer() {
    if (drawerRef.current) {
      drawerRef.current.checked = false;
    }
  }

  return (
    <div className="drawer drawer-end z-50">
      <input
        ref={drawerRef}
        id="mobile-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content">
        <header className="fixed z-10 flex h-20 w-full items-center justify-between bg-white px-6 shadow dark:bg-neutral-900 sm:px-10">
          <Link href="/" aria-label="Chave do Bem">
            <Image
              src="/logo.png"
              alt="Chave do Bem"
              width={80}
              height={20}
              priority
            />
          </Link>

          <ul className="hidden list-none gap-6 text-color-header sm:flex">
            {publicLinks.slice(0, 4).map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-bold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {user && (
              <Link
                href={user.role === "CUSTOMER" ? "/perfil" : "/home"}
                className="btn btn-neutral btn-outline btn-theme hidden sm:flex"
              >
                Minha conta
              </Link>
            )}

            <label
              htmlFor="mobile-drawer"
              className="btn btn-neutral btn-outline btn-theme sm:hidden"
              aria-label="Abrir menu de navegacao"
            >
              <FaAlignJustify />
            </label>
          </div>
        </header>
      </div>

      <div className="drawer-side z-20">
        <label
          htmlFor="mobile-drawer"
          aria-label="Fechar menu"
          className="drawer-overlay"
        />

        <ul className="menu min-h-full w-72 space-y-2 bg-white p-6 text-lg text-color-header dark:bg-neutral-900">
          <li className="mb-2 text-xs font-black uppercase tracking-widest text-zinc-400">
            Navegacao
          </li>
          {publicLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={closeDrawer}>
                {link.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link
                href={user.role === "CUSTOMER" ? "/perfil" : "/home"}
                onClick={closeDrawer}
              >
                Minha conta
              </Link>
            </li>
          )}
          <li className="pt-4">
            <Link
              href="/login"
              onClick={closeDrawer}
              className="btn btn-neutral btn-theme w-full"
            >
              Entrar
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
