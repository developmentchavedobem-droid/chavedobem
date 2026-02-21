import Image from "next/image";

export default function Card() {
    return (
        <div className="w-full h-full rounded-2xl flex flex-col">
            <div className="w-full h-1/2 rounded-t-2xl">
                <Image
                    className="w-full h-full"
                    src="/fogao.png"
                    alt="Item sorteio"
                    height={300}
                    width={300}
                />
            </div>
            <div className="w-full h-1/2 p-5 flex flex-col justify-between bg-zinc-200 text-[#053B80] rounded-b-2xl">
                <h4 className="font-bold text-lg">Fogão #13</h4>
                <p>Sorteio realizado em: 12/01/2026</p>
                <button className="btn btn-neutral w-full btn-theme">
                    Visualizar
                </button>
            </div>

        </div>
    )
}