"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Play, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MediaItem {
  type: "image" | "video"
  title: string
  src: string
  thumbnail?: string
}

export function MediaSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)
  const [filter, setFilter] = useState<"all" | "images" | "videos">("all")

  const mediaItems: MediaItem[] = [
    {
      type: "image",
      title: "Laboratory Research with Colleagues",
      src: "/lab-colleagues.png",
    },
    {
      type: "image",
      title: "Professional Medical Team",
      src: "/professional-team.png",
    },
    {
      type: "image",
      title: "Advanced Surgical Microscope Procedure",
      src: "/surgical-microscope.png",
    },
    {
      type: "image",
      title: "Nepal Laser Surgery Workshop",
      src: "/nepal-workshop.png",
    },
    {
      type: "image",
      title: "Brain Research and Neurology",
      src: "/brain-hologram.png",
    },
    {
      type: "image",
      title: "Award Ceremony at Alfaisal University",
      src: "/award-ceremony.png",
    },
    {
      type: "image",
      title: "Certificate Recognition",
      src: "/certificate-ceremony.png",
    },
    {
      type: "image",
      title: "Surgical Procedure - Head and Neck",
      src: "/surgical-procedure-1.png",
    },
    {
      type: "image",
      title: "Graduation Ceremony with Students",
      src: "/graduation-ceremony.png",
    },
    {
      type: "image",
      title: "Medical Conference Networking",
      src: "/conference-group.png",
    },
    {
      type: "image",
      title: "Precision Surgical Techniques",
      src: "/surgical-procedure-2.png",
    },
    {
      type: "image",
      title: "Surgical Team in Action",
      src: "/surgical-team.png",
    },
    {
      type: "image",
      title: "Healthcare Conference Presentation",
      src: "/healthcare-conference.png",
    },
    {
      type: "image",
      title: "Mentoring Students and Residents",
      src: "/students-gathering.png",
    },
    {
      type: "image",
      title: "Modern Hospital Facilities",
      src: "/modern-hospital.png",
    },
    {
      type: "image",
      title: "Medical Conference",
      src: "/medical-conference.png",
    },
    {
      type: "image",
      title: "Medical Research Lab",
      src: "/medical-research-lab.png",
    },
    {
      type: "video",
      title: "Lecture on Voice Disorders",
      src: "https://www.youtube.com/embed/uHWZBXF7zDA",
      thumbnail: "/surgical-procedure-1.png",
    },
    {
      type: "video",
      title: "Surgical Techniques",
      src: "https://www.youtube.com/embed/JQaFaMckMFg",
      thumbnail: "/surgical-procedure-2.png",
    },
    {
      type: "video",
      title: "Research on Vocal Cord Paralysis",
      src: "https://www.youtube.com/embed/R6icxnmkMaQ",
      thumbnail: "/surgical-team.png",
    },
    {
      type: "video",
      title: "Innovations in Laryngology",
      src: "https://www.youtube.com/embed/SMEFFNulb3M",
      thumbnail: "/brain-hologram.png",
    },
  ]

  const openLightbox = (media: MediaItem) => {
    setCurrentMedia(media)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  const filteredMedia =
    filter === "all"
      ? mediaItems
      : filter === "images"
        ? mediaItems.filter((item) => item.type === "image")
        : mediaItems.filter((item) => item.type === "video")

  return (
    <section className="py-24 bg-background relative" id="gallery">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl font-serif font-bold text-primary mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Media Gallery
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 96 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p
            className="text-lg text-foreground/70 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Explore images and videos from Dr. Chhetri's professional activities, conferences, and surgical procedures
          </motion.p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-card/80 backdrop-blur-sm rounded-full shadow-md p-1 border border-border/50">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-primary",
              )}
            >
              All Media
            </button>
            <button
              onClick={() => setFilter("images")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                filter === "images"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-primary",
              )}
            >
              Images
            </button>
            <button
              onClick={() => setFilter("videos")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                filter === "videos"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-primary",
              )}
            >
              Videos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item, index) => (
            <motion.div
              key={index}
              className="group bg-card rounded-xl overflow-hidden shadow-md border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.6) }}
            >
              <div className="aspect-square relative cursor-pointer" onClick={() => openLightbox(item)}>
                <Image
                  src={item.type === "image" ? item.src : item.thumbnail || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Play button for videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}

                {/* View button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary/80 text-white px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <ExternalLink size={16} />
                    <span>{item.type === "image" ? "View Image" : "Watch Video"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentMedia && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-20"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full">
            {currentMedia.type === "image" ? (
              <Image
                src={currentMedia.src || "/placeholder.svg"}
                alt={currentMedia.title}
                width={1200}
                height={800}
                className="object-contain mx-auto max-h-[80vh] rounded-lg"
              />
            ) : (
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src={currentMedia.src}
                  title={currentMedia.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
