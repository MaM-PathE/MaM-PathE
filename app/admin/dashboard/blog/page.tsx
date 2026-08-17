"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Trash2, Upload, AlertCircle, CheckCircle, Loader2, Calendar } from "lucide-react"
import Image from "next/image"

export default function BlogManagement() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/blog")
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setError("Failed to load blog posts")
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

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      if (imageFile) formData.append("image", imageFile)

      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add blog post")
      }

      // Reset form
      setTitle("")
      setContent("")
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      setSuccess("Blog post added successfully")
      fetchPosts()
    } catch (error) {
      console.error("Error adding blog post:", error)
      setError(error instanceof Error ? error.message : "Failed to add blog post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete blog post")
      }

      setSuccess("Blog post deleted successfully")
      fetchPosts()
    } catch (error) {
      console.error("Error deleting blog post:", error)
      setError(error instanceof Error ? error.message : "Failed to delete blog post")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6 rounded-xl shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-3 h-8 w-8 text-indigo-600" />
            <span>Blog Management</span>
          </h1>
          <div className="text-sm text-gray-500">Manage your blog content</div>
        </div>

        {/* Add Blog Post Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add New Blog Post</h2>

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
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter blog post title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={8}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Write your blog post content here..."
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image (optional)
              </label>
              <div className="mt-1 flex items-center">
                <Input
                  id="image"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
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
                <span className="ml-3 text-sm text-gray-500">{imageFile ? imageFile.name : "No file selected"}</span>
              </div>
            </div>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative h-40 w-64 rounded-md overflow-hidden border border-gray-200">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Blog Posts List */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Your Blog Posts</h2>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your first blog post using the form above. Blog posts will appear in the Blog section of your
                website.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-medium text-gray-900">{post.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    <div className="flex">
                      {post.image_url && (
                        <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-gray-600 line-clamp-3">{post.content}</p>
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
