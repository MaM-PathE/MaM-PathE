"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, BookOpen } from "lucide-react"

interface Post { id: number; title: string; content: string; image_url?: string | null; created_at: string }

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    fetch("/api/blog", { cache: "no-store" }).then((res) => res.ok ? res.json() : { posts: [] }).then((data) => setPosts(data.posts || [])).catch(() => setPosts([]))
  }, [])

  return (
    <section id="blog" className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 border-b border-border/60 pb-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-primary">Latest writing</p><h2 className="font-serif text-5xl leading-none text-foreground sm:text-6xl">Blog</h2></div>
          <p className="max-w-xl text-lg leading-8 text-foreground/70">Articles, reflections, and updates from Dr. Chhetri.</p>
        </div>
        {posts.length === 0 ? <div className="mt-12 rounded-2xl border border-border/60 bg-card/70 p-10"><BookOpen className="mb-8 text-primary" /><h3 className="mb-4 font-serif text-3xl text-foreground">No articles published yet</h3><p className="leading-7 text-foreground/70">New articles will appear here after publication from the admin studio.</p></div> : <div className="mt-12 grid gap-6 md:grid-cols-2">{posts.map((post) => <article key={post.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm">{post.image_url && <img src={post.image_url} alt="" className="h-48 w-full object-cover" />}<div className="p-8"><div className="mb-8 flex items-start justify-between"><BookOpen className="text-primary" /><ArrowUpRight className="text-primary/60" /></div><h3 className="mb-4 font-serif text-3xl text-foreground">{post.title}</h3><p className="line-clamp-4 leading-7 text-foreground/70">{post.content}</p></div></article>)}</div>}
      </div>
    </section>
  )
}
