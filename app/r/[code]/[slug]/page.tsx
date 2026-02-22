import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/src/lib/prisma"

interface Props {
  params: {
    code: string
    slug: string
  }
}

export default async function ReferralRedirect({ params }: Props) {
  const { code, slug } = params

  // 1️⃣ Buscar referral
  const referral = await prisma.referralLink.findUnique({
    where: { code }
  })

  if (!referral) {
    return redirect(`/campanha/${slug}`)
  }

  // 2️⃣ Buscar campanha
  const campaign = await prisma.campaign.findUnique({
    where: { slug }
  })

  if (!campaign || campaign.status !== "ACTIVE") {
    return redirect("/sorteios")
  }

  // 3️⃣ Await headers()
  const headersList = await headers()

  const ip =
    headersList.get("x-forwarded-for") ??
    headersList.get("x-real-ip") ??
    null

  const userAgent = headersList.get("user-agent") ?? null

  // 4️⃣ Registrar visita
  await prisma.visit.create({
    data: {
      referralId: referral.id,
      campaignId: campaign.id,
      ip,
      userAgent
    }
  })

  // 5️⃣ Await cookies()
  const cookieStore = await cookies()

  cookieStore.set("referral_code", code, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  })

  // 6️⃣ Redirect final
  redirect(`/campanha/${slug}`)
}