import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center w-full h-full">
            <h1>Página não encontrada...</h1>
            <Link href='/'>Voltar para página inicial</Link>
        </div>
    )
}