import Image from "next/image"
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaSquareYoutube } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";

export default function Footer() {
    return(
        <footer className="w-full sm:h-50 bg-linear-to-r from-[#1d8c6d] to-[#026e93] flex flex-inline flex-wrap gap-5 sm:gap-0 sm:flex-row items-start justify-between px-5 sm:px-15 py-10 sm:py-5">
            <Image
                className="w-20 sm:w-72 md:w-40 h-auto "
                src="/logo.png"
                alt="ChaveDoBem logo"
                width={300}
                height={300}
                priority
            />
            <div className="flex flex-col">
                <span className="font-bold">Social</span>
                <div className="flex gap-4">
                    <FaInstagram size={26} />
                    <FaFacebook size={26} />
                    <FaSquareYoutube size={26} />
                </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
                <span className="font-bold">Fale conosco</span>
                <div className="flex gap-4">
                    <FaPhone size={20} />
                    <span>(11) 99559-2200</span>
                </div>
                <div className="flex gap-4">
                    <FaEnvelope size={20} />
                    <span>contato@chavedobem.com.br</span>
                </div>
                <div className="flex gap-4">
                    <FaLocationDot size={20} />
                    <span>Av. Itajaúna, Centro, SP.</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <Link href="/quem-somos" className="font-semibold">
                    Quem Somos
                </Link>
                <Link href="/politica-privacidade" className="font-semibold">
                    Politica de Privacidade
                </Link>
                <Link href="/termos-uso" className="font-semibold">
                    Termos de Uso
                </Link>
            </div>
        </footer>
    )
}