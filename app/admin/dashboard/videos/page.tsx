"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Video, Plus, Trash2, Upload, AlertCircle, CheckCircle, Loader2, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function VideosManagement() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [embedUrl, setEmbedUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [category, setCategory] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/videos")
      const data = await res.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error("Error fetching videos:", error)
      setError("Failed to load videos")
    } finally {
      setLoading(false)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim() || (!embedUrl.trim() && !videoFile)) {
      setError("Title and a video URL or file are required")
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("embed_url", embedUrl)
      if (videoFile) formData.append("video_file", videoFile)
      if (category) formData.append("category", category)
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile)

      const res = await fetch("/api/admin/videos", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        let message = "Failed to add video"
        try {
          const data = JSON.parse(text)
          message = data.error || message
        } catch {
          message = text || `Request failed (${res.status})`
        }
        throw new Error(message)
      }

      // Reset form
      setTitle("")
      setEmbedUrl("")
      setVideoFile(null)
      setCategory("")
      setThumbnailFile(null)
      setThumbnailPreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      setSuccess("Video added successfully")
      fetchVideos()
    } catch (error) {
      console.error("Error adding video:", error)
      setError(error instanceof Error ? error.message : "Failed to add video")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    try {
      const res = await fetch("/api/admin/videos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete video")
      }

      setSuccess("Video deleted successfully")
      fetchVideos()
    } catch (error) {
      console.error("Error deleting video:", error)
      setError(error instanceof Error ? error.message : "Failed to delete video")
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6 rounded-xl shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Video className="mr-3 h-8 w-8 text-indigo-600" />
            <span>Videos Management</span>
          </h1>
          <div className="text-sm text-gray-500">Manage your video content</div>
        </div>

        {/* Add Video Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add New Video</h2>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter video title"
                />
              </div>

              <div>
                <label htmlFor="embedUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (optional)
                </label>
                <Input
                  id="embedUrl"
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="YouTube, Vimeo, or direct video URL (optional)"
                />
                <p className="mt-1 text-xs text-gray-500">Example: https://www.youtube.com/embed/dQw4w9WgXcQ</p>
              </div>
            </div>

              <div>
                <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload video file (MP4, WebM, MOV, and other browser-supported formats)
                </label>
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="border-gray-300"
                />
                <p className="mt-1 text-xs text-gray-500">Or use the video URL above. Maximum file size: 250MB.</p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category (optional)
              </label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., Conference, Lecture, Tutorial"
              />
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                Custom Thumbnail (optional)
              </label>
              <div className="mt-1 flex items-center">
                <Input
                  id="thumbnail"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center border-dashed border-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Image
                </Button>
                <span className="ml-3 text-sm text-gray-500">
                  {thumbnailFile ? thumbnailFile.name : "No file selected"}
                </span>
              </div>
            </div>

            {thumbnailPreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative h-40 w-64 rounded-md overflow-hidden border border-gray-200">
                  <Image src={thumbnailPreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Video
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Video Gallery */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Your Videos</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-md mb-3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your first video using the form above. Videos will appear in the Videos section of your website.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <Video className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={video.embed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full"
                      >
                        <ExternalLink className="h-5 w-5 text-indigo-600" />
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                    {video.category && <p className="text-sm text-gray-500 mb-2">{video.category}</p>}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{new Date(video.created_at).toLocaleDateString()}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(video.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
