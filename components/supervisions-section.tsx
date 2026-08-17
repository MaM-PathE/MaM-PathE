"use client"

import { useEffect, useState } from "react"
import { Building, Calendar, User, FileText, ArrowRight } from "lucide-react"

interface Supervision {
  id: number
  student_name: string
  project_title: string
  institution: string
  period: string
  description?: string
  status: "completed" | "ongoing"
}

export function SupervisionsSection() {
  const [supervisions, setSupervisions] = useState<Supervision[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing">("all")

  useEffect(() => {
    fetch("/api/supervisions")
      .then((response) => (response.ok ? response.json() : { supervisions: [] }))
      .then((data) => setSupervisions(Array.isArray(data.supervisions) ? data.supervisions : []))
      .catch(() => setSupervisions([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === "all" ? supervisions : supervisions.filter((item) => item.status === filter)

  return (
    <section className="bg-background py-24" id="supervisions">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-serif font-bold text-primary">Academic Supervision</h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-primary" />
          <p className="mx-auto max-w-2xl text-foreground/70">Mentoring the next generation of medical researchers and practitioners</p>
        </div>
        <div className="mb-10 flex justify-center gap-2">
          {(["all", "ongoing", "completed"] as const).map((value) => (
            <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${filter === value ? "bg-primary text-primary-foreground" : "border border-border text-foreground/70 hover:text-primary"}`}>
              {value === "all" ? "All Projects" : value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        {loading ? <p className="text-center text-muted-foreground">Loading supervision projects...</p> : filtered.length === 0 ? <p className="text-center text-muted-foreground">No supervision projects are available yet.</p> : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filtered.map((item) => (
              <article key={item.id} className="group overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all hover:shadow-lg">
                <div className="p-6">
                  <div className="mb-4 flex items-start justify-between gap-4"><h3 className="line-clamp-2 text-xl font-serif font-bold">{item.project_title}</h3><span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium">{item.status === "completed" ? "Completed" : "Ongoing"}</span></div>
                  <div className="mb-4 grid grid-cols-1 gap-3 text-sm text-foreground/70 md:grid-cols-2"><span className="flex items-center gap-2"><User className="text-primary" size={16} />{item.student_name}</span><span className="flex items-center gap-2"><Building className="text-primary" size={16} />{item.institution}</span><span className="flex items-center gap-2"><Calendar className="text-primary" size={16} />{item.period}</span><span className="flex items-center gap-2"><FileText className="text-primary" size={16} />Research Project</span></div>
                  {item.description && <p className="mb-4 line-clamp-3 text-foreground/70">{item.description}</p>}
                  <button type="button" className="inline-flex items-center text-sm font-medium text-primary">View Details <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={14} /></button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
