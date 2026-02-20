export default function WhoWeAre() {
    return(
        <section className="pt-10">
            <section className="relative bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20 px-6 overflow-hidden">
                
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

                <div className="relative max-w-5xl mx-auto">
                    
                    <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Quem Somos
                    </h1>
                    <div className="w-24 h-1 bg-white/70 mx-auto rounded-full"></div>
                    </header>

                    <article className="space-y-8 text-lg leading-relaxed text-white/95">

                    <p>
                        A <strong>Chave do Bem</strong> nasce com um propósito claro: ampliar o acesso à ajuda real em todo o Brasil. 
                        Somos uma plataforma nacional que conecta pessoas em situação de vulnerabilidade a oportunidades concretas de apoio — 
                        de forma gratuita, simples e acessível.
                    </p>

                    <p>
                        Nossa atuação é direta e objetiva. Promovemos ações solidárias amplamente divulgadas pela internet, 
                        permitindo que qualquer pessoa, de qualquer região do país, possa se cadastrar sem custos. 
                        Quando selecionada, ela recebe suporte verdadeiro — seja por meio de bens essenciais, eletrodomésticos ou auxílio financeiro.
                    </p>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
                        <p className="text-xl font-semibold text-center">
                        Não solicitamos pagamentos.  
                        Não cobramos taxas.  
                        Não exigimos contribuições.
                        </p>
                        <p className="text-center mt-4 text-white/90">
                        Aqui, quem participa entra para ser ajudado — sem obrigações.
                        </p>
                    </div>

                    <p>
                        Acreditamos que solidariedade não deve depender de localização, renda ou burocracia. 
                        Utilizamos a tecnologia como ponte para alcançar centros urbanos, periferias, comunidades isoladas 
                        e regiões remotas. Onde houver necessidade, buscamos estar presentes.
                    </p>

                    <p>
                        Não somos uma instituição filantrópica tradicional e não representamos órgãos públicos. 
                        Somos uma rede independente que atua com responsabilidade, organização e compromisso diário 
                        com quem precisa.
                    </p>

                    <p>
                        Transparência é um valor inegociável para nós. Todas as ações realizadas são legítimas, 
                        conduzidas com seriedade e divulgadas em nossos canais oficiais. 
                        O que anunciamos é cumprido — com respeito e responsabilidade.
                    </p>

                    <div className="border-l-4 border-white/80 pl-6 py-2">
                        <p className="text-xl italic">
                        A Chave do Bem é aposta.  
                        É acesso.
                        </p>
                    </div>

                    <p>
                        Nosso trabalho é estar disponível antes que a urgência se transforme em emergência. 
                        É mostrar que ainda existem caminhos possíveis — mesmo quando tudo parece fechado.
                    </p>

                    <p className="text-lg font-semibold">
                        Não prometemos milagres.  
                        Não criamos ilusões.  
                        Entregamos ajuda concreta.
                    </p>

                    <p>
                        E seguimos firmes, todos os dias, conectando quem precisa ao que pode transformar sua realidade.
                    </p>

                    </article>

                </div>
                </section>
        </section>
    )
}