"use client"

import { FormEvent, useEffect, useState } from "react"
import { BookOpen, Trash2, Upload, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CoursesAdminPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState("document")

  async function load() { const res = await fetch("/api/admin/courses"); const data = await res.json(); setMaterials(data.materials || []) }
  useEffect(() => { load() }, [])

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("")
    const form = new FormData(event.currentTarget); form.set("material_type", type)
    const res = await fetch("/api/admin/courses", { method: "POST", body: form }); const data = await res.json()
    if (!res.ok) setMessage(data.error || "Unable to publish")
    else { setMessage("Published successfully."); event.currentTarget.reset(); setType("document"); await load() }
    setBusy(false)
  }

  async function remove(id: number) { if (!window.confirm("Delete this material?")) return; await fetch("/api/admin/courses", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load() }

  return <main className="min-h-screen bg-background p-6 text-foreground md:p-10"><div className="mx-auto max-w-6xl"><div className="mb-10"><p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Admin library</p><h1 className="mt-3 text-4xl font-display font-semibold">Courses & lectures</h1><p className="mt-2 text-muted-foreground">Publish PDFs, presentations and short lecture links.</p></div><div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]"><form onSubmit={publish} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"><h2 className="text-xl font-semibold">Publish material</h2><Input name="title" placeholder="Title" required /><Input name="chapter" placeholder="Chapter or course" /><Textarea name="description" placeholder="Description" rows={4} /><div className="flex gap-2"><Button type="button" variant={type === "document" ? "default" : "outline"} onClick={() => setType("document")}><BookOpen data-icon="inline-start" />Document</Button><Button type="button" variant={type === "video" ? "default" : "outline"} onClick={() => setType("video")}><Video data-icon="inline-start" />Video</Button></div>{type === "video" ? <Input name="video_url" placeholder="YouTube or Vimeo URL" type="url" required /> : <Input name="file" type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" required />}<Button type="submit" disabled={busy}>{busy ? "Publishing…" : <><Upload data-icon="inline-start" />Publish course</>}</Button>{message && <p className="text-sm text-muted-foreground" role="status">{message}</p>}</form><section className="flex flex-col gap-3"><h2 className="text-xl font-semibold">Published materials</h2>{materials.length === 0 ? <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">No materials published yet.</div> : materials.map((item) => <article key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5"><div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.chapter || item.material_type} · {item.file_name || item.video_url}</p></div><Button variant="ghost" size="icon" onClick={() => remove(item.id)} aria-label={`Delete ${item.title}`}><Trash2 data-icon /></Button></article>)}</section></div></div></main>
}
