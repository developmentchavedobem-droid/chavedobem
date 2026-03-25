import { notFound } from "next/navigation"
import prisma from "@/src/lib/prisma"
import ProgressBar from "@/src/components/campaign/ProgressBar"
import TopUsers from "@/src/components/campaign/TopUsers"
import Countdown from "@/src/components/campaign/Countdown"

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function CampaignPage({ params }: Props) {
  // No Next.js 15, params deve ser aguardado
  const { slug } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { tickets: true }
      }
    }
  })

  // Verificamos se a campanha existe e se está ativa
  if (!campaign || campaign.status !== "ACTIVE") {
    return notFound()
  }

  const totalTickets = campaign._count.tickets

  // Agrupando pelo ID do Perfil que resgatou o ticket
  const topUsersRaw = await prisma.ticket.groupBy({
    by: ["profileId"],
    where: { campaignId: campaign.id },
    _count: {
      profileId: true
    },
    orderBy: {
      _count: {
        profileId: "desc"
      }
    },
    take: 5
  })

  // Como o groupBy não traz os nomes dos usuários, buscamos os nomes dos top 5
  const topUsers = await Promise.all(
    topUsersRaw.map(async (group) => {
      const profile = await prisma.profile.findUnique({
        where: { id: group.profileId },
        select: { name: true }
      });
      return {
        name: profile?.name || "Usuário Anônimo",
        count: group._count.profileId
      };
    })
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 text-gray-800">

      {/* HERO */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold text-[#053B80]">
          {campaign.name}
        </h1>

        <p className="text-lg text-gray-600">
          Uma campanha da <strong>Chave do Bem</strong> criada para transformar sonhos em realidade.
        </p>

        <ProgressBar
          current={Number(campaign.currentAmount)}
          goal={Number(campaign.goal)}
        />

        <Countdown />

        <div className="pt-4">
          <a
            href={`/campanha/${campaign.slug}/cupons`}
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
          >
            Quero Participar
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="space-y-6 text-lg leading-relaxed border-l-4 border-[#053B80] pl-6 bg-gray-50 py-4 rounded-r-xl">
        <h2 className="text-2xl font-semibold text-[#053B80]">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-500">
            Bilhetes já resgatados
          </h3>
          <p className="text-5xl font-black text-[#053B80]">
            {totalTickets.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Passando os usuários já com os nomes para o componente */}
        <TopUsers users={topUsers} />
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-12 bg-[#053B80] rounded-3xl text-white space-y-8">
        <h2 className="text-3xl font-bold">
          O sonho começa aqui
        </h2>

        <a
          href={`/campanha/${campaign.slug}/tutorial`}
          className="inline-block bg-white text-[#053B80] px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-xl"
        >
          Ver Como Participar
        </a>
      </section>
    </main>
  )
}