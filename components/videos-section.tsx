import { Video } from "lucide-react"

interface VideoItem {
  title: string
  embedUrl: string
}

const videos: VideoItem[] = [
  {
    title: "Conférence sur les troubles de la voix",
    embedUrl: "https://www.youtube.com/embed/uHWZBXF7zDA",
  },
  {
    title: "Techniques chirurgicales laryngées",
    embedUrl: "https://www.youtube.com/embed/JQaFaMckMFg",
  },
  {
    title: "Recherche sur la paralysie des cordes vocales",
    embedUrl: "https://www.youtube.com/embed/R6icxnmkMaQ",
  },
  {
    title: "Innovations en laryngologie",
    embedUrl: "https://www.youtube.com/embed/SMEFFNulb3M",
  },
]

export function VideosSection() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-playfair font-semibold mb-6 border-b pb-2">Conférences</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="aspect-video w-full">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Video size={14} className="text-primary" />
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
