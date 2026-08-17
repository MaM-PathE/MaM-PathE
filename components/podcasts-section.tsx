"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Headphones, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface Podcast {
  id: number
  title: string
  description: string | null
  audio_url: string
  created_at: string
}

export function PodcastsSection() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)

  // Récupérer les podcasts depuis l'API (aucune donnée fictive)
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("/api/podcasts")
        if (!response.ok) throw new Error("Failed to fetch podcasts")

        const data = await response.json()
        const list: Podcast[] = Array.isArray(data.podcasts) ? data.podcasts : []
        setPodcasts(list)
        if (list.length > 0) {
          setCurrentPodcast(list[0])
        }
      } catch (error) {
        console.error("Error fetching podcasts:", error)
        setPodcasts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPodcasts()
  }, [])

  // Attacher les écouteurs à l'élément audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration || 0)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      const currentIndex = podcasts.findIndex((p) => p.id === currentPodcast?.id)
      if (currentIndex > -1 && currentIndex < podcasts.length - 1) {
        setCurrentPodcast(podcasts[currentIndex + 1])
        setIsPlaying(true)
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentPodcast, podcasts])

  // Charger et jouer/mettre en pause à chaque changement
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentPodcast) return

    if (audio.src !== currentPodcast.audio_url) {
      audio.src = currentPodcast.audio_url
      audio.load()
      setCurrentTime(0)
    }

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, currentPodcast])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(date)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }

  const handlePlayPause = () => setIsPlaying((prev) => !prev)

  const handlePrevious = () => {
    const currentIndex = podcasts.findIndex((p) => p.id === currentPodcast?.id)
    if (currentIndex > 0) {
      setCurrentPodcast(podcasts[currentIndex - 1])
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    const currentIndex = podcasts.findIndex((p) => p.id === currentPodcast?.id)
    if (currentIndex > -1 && currentIndex < podcasts.length - 1) {
      setCurrentPodcast(podcasts[currentIndex + 1])
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const selectPodcast = (podcast: Podcast) => {
    if (currentPodcast?.id === podcast.id) {
      handlePlayPause()
    } else {
      setCurrentPodcast(podcast)
      setIsPlaying(true)
    }
  }

  const currentIndex = podcasts.findIndex((p) => p.id === currentPodcast?.id)

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8" id="podcasts">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="section-title mx-auto">Podcasts & Audio Lectures</h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            Listen to Dr. Chhetri&apos;s podcasts, interviews, and audio lectures on head and neck surgery, laryngology,
            and voice disorders.
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        ) : podcasts.length === 0 ? (
          // État vide élégant - prêt à accueillir du contenu
          <div className="max-w-xl mx-auto text-center bg-card border border-border/60 rounded-2xl p-12 shadow-sm">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Headphones className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">Podcasts coming soon</h3>
            <p className="text-foreground/60 leading-relaxed">
              New episodes and audio lectures will be published here soon. Check back shortly to listen to the latest
              conversations on laryngology and head &amp; neck surgery.
            </p>
          </div>
        ) : (
          <>
            {/* Featured player */}
            {currentPodcast && (
              <div className="mb-12 rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm">
                <div className="flex flex-col md:flex-row">
                  {/* Cover */}
                  <div className="w-full md:w-64 lg:w-72 aspect-square md:aspect-auto shrink-0 relative bg-primary/5">
                    <img
                      src="/podcast-cover.png"
                      alt={currentPodcast.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Player */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">Now Playing</p>
                      <h3 className="text-2xl font-serif font-bold text-foreground text-balance">
                        {currentPodcast.title}
                      </h3>
                      {currentPodcast.description && (
                        <p className="text-foreground/60 mt-2 leading-relaxed line-clamp-2">
                          {currentPodcast.description}
                        </p>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div
                        className="h-2 bg-primary/15 rounded-full cursor-pointer"
                        ref={progressRef}
                        onClick={handleProgressClick}
                      >
                        <div
                          className="h-full bg-primary rounded-full transition-[width] duration-150"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handlePrevious}
                          disabled={currentIndex <= 0}
                          className="text-foreground/70 hover:text-primary hover:bg-primary/10"
                          aria-label="Previous episode"
                        >
                          <SkipBack size={20} />
                        </Button>
                        <Button
                          size="icon"
                          onClick={handlePlayPause}
                          className="h-12 w-12 rounded-full"
                          aria-label={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleNext}
                          disabled={currentIndex === podcasts.length - 1}
                          className="text-foreground/70 hover:text-primary hover:bg-primary/10"
                          aria-label="Next episode"
                        >
                          <SkipForward size={20} />
                        </Button>
                      </div>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsMuted((m) => !m)}
                          className="text-foreground/70 hover:text-primary hover:bg-primary/10"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 sm:w-24 accent-primary"
                          aria-label="Volume"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Episode list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map((podcast) => {
                const isActive = currentPodcast?.id === podcast.id
                return (
                  <button
                    key={podcast.id}
                    onClick={() => selectPodcast(podcast)}
                    className={cn(
                      "text-left rounded-2xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive ? "border-primary ring-1 ring-primary" : "border-border/60 hover:border-primary/40",
                    )}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-colors",
                          isActive && isPlaying ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                        )}
                      >
                        {isActive && isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif font-bold text-foreground line-clamp-1">{podcast.title}</h3>
                        {podcast.description && (
                          <p className="text-sm text-foreground/60 line-clamp-2 mt-1 leading-relaxed">
                            {podcast.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 text-xs text-foreground/40 mt-2">
                          <Mic size={12} />
                          <span>{formatDate(podcast.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Élément audio (une seule instance, source réelle) */}
      <audio ref={audioRef} preload="metadata" className="hidden" />
    </section>
  )
}
