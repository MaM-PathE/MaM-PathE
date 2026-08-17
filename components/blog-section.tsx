"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, BookOpen, X } from "lucide-react"

interface Post { id: number; title: string; content: string; image_url?: string | null; created_at: string }

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

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
        {posts.length === 0 ? <div className="mt-12 rounded-2xl border border-border/60 bg-card/70 p-10"><BookOpen className="mb-8 text-primary" /><h3 className="mb-4 font-serif text-3xl text-foreground">No articles published yet</h3><p className="leading-7 text-foreground/70">New articles will appear here after publication from the admin studio.</p></div> : <div className="mt-12 grid gap-6 md:grid-cols-2">{posts.map((post) => <button type="button" key={post.id} onClick={() => setSelectedPost(post)} className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">{post.image_url && <img src={post.image_url} alt="" className="h-48 w-full object-cover" />}<div className="p-8"><div className="mb-8 flex items-start justify-between"><BookOpen className="text-primary" /><ArrowUpRight className="text-primary/60" /></div><h3 className="mb-4 font-serif text-3xl text-foreground">{post.title}</h3><p className="line-clamp-4 leading-7 text-foreground/70">{post.content}</p><span className="mt-6 inline-block text-sm font-semibold text-primary">Read article</span></div></button>)}</div>}
      </div>
      {selectedPost && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={selectedPost.title} onClick={() => setSelectedPost(null)}>
          <article className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-10" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setSelectedPost(null)} className="absolute right-4 top-4 rounded-full p-2 text-foreground/60 hover:bg-muted hover:text-foreground" aria-label="Close article"><X size={20} /></button>
            {selectedPost.image_url && <img src={selectedPost.image_url} alt="" className="mb-8 max-h-80 w-full rounded-xl object-cover" />}
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">Blog article</p>
            <h3 className="mb-6 font-serif text-4xl text-foreground">{selectedPost.title}</h3>
            <p className="whitespace-pre-wrap text-base leading-8 text-foreground/80">{selectedPost.content}</p>
          </article>
        </div>
      )}
    </section>
  )
}
