import Image from "next/image"

export default function HorizontalCard() {
    return(
        <div className="w-full flex rounded-xl border overflow-hidden shadow-lg">
            <Image
                priority
                src="/fogao.png"
                alt={`fogao image`}
                width={200}
                height={120}
            />
            <div className="w-full flex flex-col px-10 py-5 bg-zinc-100">
                <h4 className="font-bold text-md text-black">Sorteio de Fogão</h4>
            </div>

        </div>
    )
}