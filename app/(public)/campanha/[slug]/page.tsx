import { notFound } from "next/navigation"
import prisma from "@/src/lib/prisma"
import ProgressBar from "@/src/components/campaign/ProgressBar"
import TopUsers from "@/src/components/campaign/TopUsers"
import Countdown from "@/src/components/campaign/Countdown"

interface Props {
  params: {
    slug: string
  }
}

export default async function CampaignPage({ params }: Props) {
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug },
    include: {
      tickets: true
    }
  })

  if (!campaign || campaign.status !== "ACTIVE") {
    return notFound()
  }

  const totalTickets = campaign.tickets.length

  const topUsers = await prisma.ticket.groupBy({
    by: ["createdById"],
    where: { campaignId: campaign.id },
    _count: {
      createdById: true
    },
    orderBy: {
      _count: {
        createdById: "desc"
      }
    },
    take: 5
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">

      {/* HERO */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold">
          {campaign.name}
        </h1>

        <p className="text-lg text-gray-600">
          Uma campanha da <strong>Chave do Bem</strong> criada para transformar sonhos em realidade.
        </p>

        <ProgressBar
          current={campaign.currentAmount}
          goal={campaign.goal}
        />

        <Countdown />

        <a
          href={`/campanha/${campaign.slug}/cupons`}
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Quero Participar
        </a>
      </section>

      {/* SOBRE */}
      <section className="space-y-6 text-lg leading-relaxed">
        <h2 className="text-2xl font-semibold">
          Sobre a campanha
        </h2>

        <p>
          Já imaginou receber um valor capaz de mudar seus planos e dar mais liberdade
          para decidir seus próximos passos?
        </p>

        <p>
          A campanha <strong>{campaign.name}</strong> foi criada exatamente para isso:
          proporcionar oportunidade real, transparência e uma experiência envolvente.
        </p>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="grid md:grid-cols-2 gap-10">

        <div className="bg-gray-100 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">
            Bilhetes já resgatados
          </h3>
          <p className="text-3xl font-bold">
            {totalTickets}
          </p>
        </div>

        <TopUsers users={topUsers} />
      </section>

      {/* CTA FINAL */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">
          O sonho começa aqui
        </h2>

        <a
          href={`/campanha/${campaign.slug}/tutorial`}
          className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Ver Como Participar
        </a>
      </section>
    </main>
  )
}