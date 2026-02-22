import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getCampaignBySlug, registerCampaignView } from "@/lib/campaign"

interface Props {
  params: {
    slug: string
  }
  searchParams: {
    affiliate?: string
  }
}

export default async function CampaignLanding({ params, searchParams }: Props) {
  const campaign = await getCampaignBySlug(params.slug)

  if (!campaign) return notFound()

  const affiliateCode = searchParams.affiliate
  const cookieStore = cookies()

  if (affiliateCode) {
    cookieStore.set("affiliate_code", affiliateCode, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    })

    await registerCampaignView({
      campaignId: campaign.id,
      affiliateCode
    })
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">
          {campaign.name} | {campaign.prizeFormatted}
        </h1>
        <p className="text-sm text-gray-500">
          {campaign.author} • {campaign.publishedAtFormatted}
        </p>
      </header>

      <section className="space-y-6 text-lg leading-relaxed">
        <p>
          Já imaginou receber um valor capaz de mudar seus planos, olhar para sua realidade atual
          e perceber que agora você pode decidir com mais liberdade o próximo passo?
        </p>

        <p>
          A campanha <strong>{campaign.name}</strong>, da <strong>Chave do Bem</strong>,
          nasce exatamente dessa sensação: transformar um desejo guardado há anos
          em uma experiência real.
        </p>

        <p>
          Aqui, o objetivo é claro: fazer alguém viver um sonho de verdade,
          daqueles que ficam para sempre na memória.
        </p>

        <div className="my-10 p-6 bg-gray-100 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">
            Uma campanha pensada para quem sonha alto
          </h2>
          <p>
            O {campaign.name} foi criado para quem deseja resolver algo importante,
            realizar um plano antigo ou simplesmente ter mais tranquilidade para decidir
            o que fazer com um valor significativo.
          </p>
        </div>

        <h2 className="text-2xl font-semibold">
          O que está em jogo nesta campanha
        </h2>

        <p>
          O prêmio principal é de <strong>{campaign.prizeFormatted}</strong>,
          oferecendo liberdade total de escolha.
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Quitar pendências</li>
          <li>Investir em algo próprio</li>
          <li>Planejar uma viagem</li>
          <li>Ajudar alguém próximo</li>
          <li>Ou simplesmente organizar sua vida financeira</li>
        </ul>

        <div className="bg-yellow-100 border border-yellow-400 p-6 rounded-xl font-semibold">
          NÃO HÁ COBRANÇAS, TAXAS OU PEDIDOS DE DADOS FINANCEIROS.
        </div>

        <h2 className="text-2xl font-semibold">
          Data do sorteio
        </h2>

        <p>
          A campanha se encerra no dia{" "}
          <strong>{campaign.endDateFormatted}</strong>,
          quando o sorteio será realizado ao vivo.
        </p>

        <h2 className="text-2xl font-semibold">
          O sonho começa aqui
        </h2>

        <p>
          Acompanhe, participe e esteja presente até o momento decisivo.
          Porque às vezes tudo o que um sonho precisa é da oportunidade certa.
        </p>
      </section>

      <section className="pt-10 flex flex-col gap-4">
        <a
          href={`/campanha/${campaign.slug}/cupons`}
          className="bg-green-600 text-white py-4 rounded-xl text-center font-semibold hover:bg-green-700 transition"
        >
          Resgatar Bilhete
        </a>

        <a
          href="/sorteios"
          className="border border-gray-400 py-4 rounded-xl text-center font-semibold hover:bg-gray-100 transition"
        >
          Ver Outras Campanhas
        </a>
      </section>
    </main>
  )
}