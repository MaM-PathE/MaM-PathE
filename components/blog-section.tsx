"use client"

import { useState, useEffect } from "react"
import { Calendar, ArrowRight, Clock, User } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface BlogPost {
  id: number
  title: string
  content: string
  image_url: string | null
  created_at: string
  author?: string
  readTime?: string
  category?: string
}

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/blog")
      if (!res.ok) throw new Error("Failed to fetch posts")
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-24 relative overflow-hidden" id="blog">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">Blog</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Latest insights, research findings, and medical perspectives from Dr. Chhetri
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                variants={item}
              >
                {post.image_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-foreground/60 mb-3">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-foreground/70 mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User size={14} className="mr-1 text-primary" />
                      <span className="text-sm text-primary">{post.author}</span>
                    </div>
                    <button 
                      onClick={() => {
                        console.log("[v0] Opening post modal:", post.title)
                        setSelectedPost(post)
                      }}
                      className="text-primary text-sm font-medium hover:text-primary/80 transition-colors flex items-center"
                    >
                      Read More <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="sticky top-0 right-0 p-4 text-foreground/60 hover:text-foreground z-10 float-right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {selectedPost.image_url && (
                <div className="relative h-96 w-full mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={selectedPost.image_url}
                    alt={selectedPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-4 mb-4 text-sm text-foreground/60">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(selectedPost.created_at)}</span>
                </div>
                {selectedPost.readTime && (
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                )}
                {selectedPost.category && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {selectedPost.category}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-display font-bold mb-4 text-foreground">
                {selectedPost.title}
              </h1>

              {selectedPost.author && (
                <div className="flex items-center mb-6 pb-4 border-b border-border">
                  <User size={18} className="mr-2 text-primary" />
                  <span className="text-primary font-semibold">{selectedPost.author}</span>
                </div>
              )}

              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
