"use client"

import { useEffect, useState } from "react"
import { BookOpen, Download, FileText, Play, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Material = { id: number; title: string; chapter?: string | null; description?: string | null; material_type: string; file_url?: string | null; video_url?: string | null; file_name?: string | null }

export function LecturesSection() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [filter, setFilter] = useState<"all" | "document" | "video">("all")

  useEffect(() => {
    fetch("/api/courses").then((res) => res.json()).then((data) => setMaterials(data.materials || [])).catch(() => setMaterials([]))
  }, [])

  const visible = filter === "all" ? materials : materials.filter((item) => item.material_type === filter)
  return (
    <section id="lectures" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-primary">Academic exchange</p>
          <h2 className="text-balance text-4xl font-display font-semibold tracking-tight text-foreground md:text-6xl">Lectures & courses</h2>
          <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">Selected teaching materials and short lectures in laryngology, voice, swallowing and airway care.</p>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {[['all','All materials'],['document','Course materials'],['video','Short lectures']].map(([value, label]) => (
            <button key={value} onClick={() => setFilter(value as typeof filter)} className={cn("rounded-full border px-4 py-2 text-sm transition-colors", filter === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/60 text-muted-foreground hover:text-foreground")}>{label}</button>
          ))}
        </div>
        {visible.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">New course materials will appear here after publication.</div> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => <motion.article key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
            <div className="mb-7 flex items-start justify-between"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{item.material_type === "video" ? <Play data-icon /> : <FileText data-icon />}</span><span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{item.chapter || "Lecture"}</span></div>
            <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{item.description || "Academic material from the Chhetri teaching library."}</p>
            <div className="mt-6 flex gap-3">{item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Download data-icon />Download</a>}{item.video_url && <a href={item.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ExternalLink data-icon />Watch</a>}</div>
          </motion.article>)}
        </div>}
      </div>
    </section>
  )
}
