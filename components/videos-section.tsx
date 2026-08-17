"use client"

import { useEffect, useState } from "react"
import { Video } from "lucide-react"

interface VideoItem {
  id: number
  title: string
  embed_url?: string
  embedUrl?: string
}

export function VideosSection() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/videos")
      .then((response) => (response.ok ? response.json() : { videos: [] }))
      .then((data) => setVideos(Array.isArray(data.videos) ? data.videos : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16" aria-labelledby="videos-title">
      <div className="mx-auto max-w-3xl px-4">
        <h2 id="videos-title" className="mb-6 border-b pb-2 text-2xl font-semibold">Conferences</h2>
        {loading ? (
          <p className="text-muted-foreground">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-muted-foreground">No videos are available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {videos.map((video) => {
              const source = video.embed_url || video.embedUrl
              if (!source) return null
              return (
                <article key={video.id} className="overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="aspect-video w-full">
                    <iframe src={source} title={video.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                  <div className="p-3"><h3 className="flex items-center gap-2 text-sm font-medium"><Video className="text-primary" size={14} />{video.title}</h3></div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
