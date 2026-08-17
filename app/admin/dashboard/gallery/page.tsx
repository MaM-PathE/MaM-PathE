"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Plus, Trash2, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/gallery")
      const data = await res.json()
      setImages(data.images || [])
    } catch (error) {
      console.error("Error fetching images:", error)
      setError("Failed to load images")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim() || !imageFile) {
      setError("Title and image are required")
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("image", imageFile)
      formData.append("type", "image")
      if (category) formData.append("category", category)

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        let message = "Failed to add image"
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
      setCategory("")
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      setSuccess("Image added successfully")
      fetchImages()
    } catch (error) {
      console.error("Error adding image:", error)
      setError(error instanceof Error ? error.message : "Failed to add image")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete image")
      }

      setSuccess("Image deleted successfully")
      fetchImages()
    } catch (error) {
      console.error("Error deleting image:", error)
      setError(error instanceof Error ? error.message : "Failed to delete image")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gallery Management</h1>

      {/* Add Image Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Image</h2>

        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category (optional)
            </label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Conference, Surgery, Research"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <div className="mt-1 flex items-center">
              <Input
                id="image"
                type="file"
                ref={fileInputRef}
                accept="image/*,.heic,.heif,image/heic,image/heif"
                onChange={handleImageChange}
                required
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
              <span className="ml-3 text-sm text-gray-500">{imageFile ? imageFile.name : "No file selected"}</span>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative h-40 w-40 rounded-md overflow-hidden border border-gray-200">
                <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Gallery Images</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>No images found. Add your first image using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                <div className="relative h-40">
                  <Image src={image.image_url || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-1">{image.title}</h3>
                  {image.category && <p className="text-sm text-gray-500 mb-2">{image.category}</p>}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{new Date(image.created_at).toLocaleDateString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
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
  )
}
