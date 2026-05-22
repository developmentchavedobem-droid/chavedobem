export default function WhoWeAre() {
  return (
    <section className="bg-zinc-100 pt-20">
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 px-6 py-20 text-white">
        <div className="absolute left-0 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <header className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Quem Somos
            </h1>
            <div className="mx-auto h-1 w-24 rounded-full bg-white/70" />
          </header>

          <article className="space-y-8 text-lg leading-relaxed text-white/95">
            <p>
              A <strong>Chave do Bem</strong> nasce com um proposito claro:
              ampliar o acesso a campanhas gratuitas, organizadas e divulgadas
              com responsabilidade para pessoas de diferentes regioes do Brasil.
            </p>

            <p>
              Nossa atuacao e direta: publicamos campanhas, explicamos as regras
              de participacao e orientamos cada visitante antes do cadastro. O
              objetivo e criar uma jornada simples, segura e transparente.
            </p>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-md">
              <p className="text-center text-xl font-semibold">
                Nao solicitamos pagamentos, taxas ou contribuicoes para liberar
                participacao.
              </p>
              <p className="mt-4 text-center text-white/90">
                Quem participa deve usar apenas os canais oficiais da plataforma.
              </p>
            </div>

            <p>
              Utilizamos tecnologia para organizar cadastros, reduzir fraudes,
              orientar participantes e registrar etapas importantes das campanhas.
              As informacoes publicadas buscam ajudar o visitante a tomar uma
              decisao informada antes de prosseguir.
            </p>

            <p>
              Nao somos uma instituicao publica e nao representamos orgaos
              governamentais. Somos uma plataforma independente que atua com
              responsabilidade, comunicacao clara e compromisso com a seguranca
              dos usuarios.
            </p>

            <p>
              Transparencia e um valor central. Por isso mantemos paginas de
              regras, politica de privacidade, termos de uso e canais de contato
              acessiveis para todos os visitantes.
            </p>

            <div className="border-l-4 border-white/80 py-2 pl-6">
              <p className="text-xl italic">
                A Chave do Bem nao e aposta. E acesso, informacao e participacao
                gratuita.
              </p>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
