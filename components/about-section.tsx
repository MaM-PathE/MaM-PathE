import { ArrowUpRight, Globe2, Mic2, Stethoscope } from "lucide-react"

export function AboutSection() {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">About the work</p>
            <h2 className="max-w-xl font-serif text-5xl leading-[0.98] text-foreground sm:text-6xl">
              Science, surgery, and the human voice.
            </h2>
          </div>
          <div className="max-w-2xl border-l border-primary/30 pl-6 lg:mb-2 lg:pl-8">
            <p className="text-lg leading-8 text-foreground/75">
              Dr. Dinesh K. Chhetri is a Professor and Interim Chair of Clinical Affairs at UCLA&apos;s Department of Head and Neck Surgery, with more than 25 years dedicated to laryngology, airway care, and surgical education.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            { icon: Mic2, label: "Voice", text: "Precision care for complex voice disorders and professional voice users." },
            { icon: Stethoscope, label: "Clinical care", text: "A patient-first practice spanning swallowing, breathing, and airway health." },
            { icon: Globe2, label: "Global education", text: "Research and training that extend better surgical care beyond one institution." },
          ].map(({ icon: Icon, label, text }) => (
            <article key={label} className="group rounded-2xl border border-border/60 bg-card/65 p-6 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-10 flex items-center justify-between">
                <Icon className="text-primary" aria-hidden="true" />
                <ArrowUpRight className="text-foreground/30 transition-colors group-hover:text-primary" aria-hidden="true" />
              </div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">{label}</p>
              <p className="leading-7 text-foreground/70">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-border/60 pt-8 md:grid-cols-[1.1fr_0.9fr]">
          <p className="max-w-2xl text-xl leading-9 text-foreground/80">
            His work connects the operating room, the research lab, and the classroom — always with the goal of helping people speak, swallow, and breathe with greater confidence.
          </p>
          <p className="text-sm leading-7 text-foreground/55 md:border-l md:border-border/60 md:pl-8">
            Focus areas include vocal fold paralysis, spasmodic dysphonia, laryngeal cancer, airway stenosis, laryngeal reinnervation, and dysphagia management.
          </p>
        </div>
      </div>
    </section>
  )
}
