import Image from "next/image";
import Link from "next/link";
import { FaEnvelope } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-linear-to-r from-[#1d8c6d] to-[#026e93] px-5 py-10 text-white sm:px-15 sm:py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Image
            className="h-auto w-30"
            src="/logo.png"
            alt="Chave do Bem"
            width={300}
            height={300}
            priority
          />

          <nav className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/quem-somos" className="font-semibold">
              Quem Somos
            </Link>
            <Link href="/politica-privacidade" className="font-semibold">
              Politica de Privacidade
            </Link>
            <Link href="/termos-uso" className="font-semibold">
              Termos de Uso
            </Link>
            <Link href="/fale-conosco" className="font-semibold">
              Fale Conosco
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/20 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026. Todos os direitos reservados. Chave do Bem.</p>
          <a
            href="mailto:contato@chavedobem.com.br"
            className="flex items-center gap-2 font-semibold underline"
          >
            <FaEnvelope />
            contato@chavedobem.com.br
          </a>
        </div>
      </div>
    </footer>
  );
}
