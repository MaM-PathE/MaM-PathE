"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Music, Plus, Trash2, Upload, AlertCircle, CheckCircle, Loader2, Play, Pause } from "lucide-react"

interface Podcast {
  id: number
  title: string
  description: string | null
  audio_url: string
  created_at: string
}

export default function PodcastsManagement() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [playing, setPlaying] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({})

  useEffect(() => {
    fetchPodcasts()
  }, [])

  const fetchPodcasts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/podcasts")
      const data = await res.json()
      setPodcasts(data.podcasts || [])
    } catch (error) {
      console.error("Error fetching podcasts:", error)
      setError("Failed to load podcasts")
    } finally {
      setLoading(false)
    }
  }

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAudioFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim() || (!audioFile && !audioUrl.trim())) {
      setError("Title and an audio file or audio URL are required")
      return
    }
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      if (audioFile) {
        const blob = await upload(`podcasts/${Date.now()}-${audioFile.name}`, audioFile, {
          access: "public",
          multipart: true,
          handleUploadUrl: "/api/blob/upload",
        })
        formData.append("audio_url", blob.url)
      } else if (audioUrl.trim()) {
        formData.append("audio_url", audioUrl.trim())
      }

      const res = await fetch("/api/podcasts", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        let message = "Failed to add podcast"
        try {
          const data = JSON.parse(text)
          message = data.error || message
        } catch {
          message = text || `Request failed (${res.status})`
        }
        throw new Error(message)
      }

      setTitle("")
      setDescription("")
      setAudioFile(null)
      setAudioUrl("")
      if (fileInputRef.current) fileInputRef.current.value = ""

      setSuccess("Podcast added successfully")
      fetchPodcasts()
    } catch (error) {
      console.error("Error adding podcast:", error)
      setError(error instanceof Error ? error.message : "Failed to add podcast")
      setAudioFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this podcast?")) return

    try {
      const res = await fetch(`/api/podcasts/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete podcast")
      }

      setSuccess("Podcast deleted successfully")
      fetchPodcasts()
    } catch (error) {
      console.error("Error deleting podcast:", error)
      setError(error instanceof Error ? error.message : "Failed to delete podcast")
    }
  }

  const togglePlay = (id: number) => {
    const audio = audioRefs.current[id]
    if (!audio) return

    if (playing === id) {
      audio.pause()
      setPlaying(null)
    } else {
      if (playing !== null && audioRefs.current[playing]) {
        audioRefs.current[playing].pause()
      }
      audio.play()
      setPlaying(id)
    }
  }

  return (
    <div className="bg-background min-h-screen p-6 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center">
            <Music className="mr-3 h-8 w-8 text-primary" />
            <span>Podcasts Management</span>
          </h1>
          <div className="text-sm text-muted-foreground">Manage your audio content</div>
        </div>

        {/* Add Podcast Form */}
        <div className="bg-card rounded-xl shadow-sm p-8 mb-10 border border-border">
          <h2 className="text-xl font-serif font-semibold mb-6 text-foreground border-b border-border pb-2">
            Add New Podcast
          </h2>

          {error && (
            <div className="p-4 mb-6 bg-destructive/10 border-l-4 border-destructive rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-primary/10 border-l-4 border-primary rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-primary text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground/80 mb-1">
                Podcast Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                placeholder="Enter podcast title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter podcast description"
                rows={3}
                maxLength={2000}
              />
            </div>

            <div>
              <label htmlFor="audio" className="block text-sm font-medium text-foreground/80 mb-1">
                Audio File (optional)
              </label>
              <div className="mt-1 flex items-center">
                <Input
                  id="audio"
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center border-dashed border-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Audio File
                </Button>
                <span className="ml-3 text-sm text-muted-foreground">
                  {audioFile ? audioFile.name : "No file selected"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Supported formats: MP3, WAV, M4A, AAC, OGG (max 100MB)</p>
            </div>

            <div>
              <label htmlFor="audioUrl" className="block text-sm font-medium text-foreground/80 mb-1">
                Or use an audio URL
              </label>
              <Input
                id="audioUrl"
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/episode.mp3"
              />
              <p className="mt-1 text-xs text-muted-foreground">Choose a file or provide a direct audio URL.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Podcast
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Podcasts List */}
        <div className="bg-card rounded-xl shadow-sm p-8 border border-border">
          <h2 className="text-xl font-serif font-semibold mb-6 text-foreground border-b border-border pb-2">
            Your Podcasts
          </h2>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-muted rounded-full mr-3" />
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-12 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          ) : podcasts.length === 0 ? (
            <div className="text-center py-16 bg-muted/40 rounded-lg border border-dashed border-border">
              <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No podcasts yet</h3>
              <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                Add your first podcast using the form above. Podcasts will appear in the Podcasts section of your
                website.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {podcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-center mb-3">
                    <button
                      onClick={() => togglePlay(podcast.id)}
                      className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary/20 transition-colors mr-3"
                      aria-label={playing === podcast.id ? "Pause" : "Play"}
                    >
                      {playing === podcast.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{podcast.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(podcast.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(podcast.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {podcast.description && <p className="text-sm text-foreground/70 mb-3">{podcast.description}</p>}

                  <audio
                    ref={(el) => {
                      if (el) audioRefs.current[podcast.id] = el
                    }}
                    src={podcast.audio_url}
                    className="w-full"
                    controls
                    onPlay={() => setPlaying(podcast.id)}
                    onPause={() => setPlaying(null)}
                    onEnded={() => setPlaying(null)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
