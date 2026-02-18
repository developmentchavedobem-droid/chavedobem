import Image from "next/image"
import Link from "next/link"
import './style.css'

export default function PublicHeader() {
  return (
      <header className="h-20 flex items-center justify-between bg-white px-10">
        <Image
          className=""
          src="/logo.svg"
          alt="ChaveDoBem logo"
          width={80}
          height={20}
          priority
        />
        <ul className="list-none flex gap-6">
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

        <button className="btn btn-neutral btn-outline btn-theme">
          Entrar
        </button>
      </header>
    )
}