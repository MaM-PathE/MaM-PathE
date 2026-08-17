import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react"

export function BlogSection() {
  return (
    <section id="blog" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 border-b border-border/60 pb-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">Coming soon</p>
            <h2 className="font-serif text-5xl leading-none text-foreground sm:text-6xl">Blog</h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-foreground/70">
            Les articles, réflexions et actualités de Dr Chhetri seront bientôt disponibles ici.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-sm sm:p-10">
            <div className="mb-16 flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen aria-hidden="true" />
              </div>
              <ArrowUpRight className="text-primary/60" aria-hidden="true" />
            </div>
            <h3 className="mb-4 font-serif text-3xl text-foreground">Un espace de partage en préparation</h3>
            <p className="max-w-xl leading-7 text-foreground/70">
              Retrouvez prochainement des contenus autour de la voix, de la chirurgie laryngée, de la recherche et de la transmission médicale.
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-primary/20 bg-primary/5 p-8 sm:p-10">
            <Clock3 className="mb-12 text-primary" aria-hidden="true" />
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">Disponible après</p>
              <p className="text-2xl leading-9 text-foreground">La prochaine mise à jour du site</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
