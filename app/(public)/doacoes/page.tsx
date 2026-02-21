import Card from "@/src/components/Card"

export default function Donates() {

    const donations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    return(
        <section className="bg-zinc-100 pt-30 pb-20 flex flex-col px-6">
            <header className="text-center mb-16">
                <h3 className="text-[#053B80] text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Doações Realizadas</h3>
                <div className="w-24 h-1 bg-cyan-900/70 mx-auto rounded-full"></div>
            </header>
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 w-5/6 mx-auto gap-5 p-3 overflow-hidden">
                {donations.map((item, index) => (
                    <Card key={index} />
                ))}
            </div>
            <div className="flex items-center justify-center mt-10">
                <button className="btn btn-neutral btn-theme">
                    Carregar mais
                </button>
            </div>
        </section>
    )
}