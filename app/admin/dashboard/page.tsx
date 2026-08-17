"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ImageIcon,
  Video,
  Music,
  Calendar,
  GraduationCap,
  ArrowRight,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  User,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [stats, setStats] = useState({
    gallery: 0,
    videos: 0,
    podcasts: 0,
    interventions: 0,
    supervisions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("Admin")

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch user info
        const userRes = await fetch("/api/auth/me")
        const userData = await userRes.json()
        if (userData.authenticated && userData.user) {
          setUsername(userData.user.username)
        }

        // Fetch gallery stats
        const galleryRes = await fetch("/api/admin/gallery")
        const galleryData = await galleryRes.json()

        // Fetch videos stats
        const videosRes = await fetch("/api/admin/videos")
        const videosData = await videosRes.json()

        // Fetch podcasts stats
        const podcastsRes = await fetch("/api/podcasts")
        const podcastsData = await podcastsRes.json()

        // Fetch interventions stats
        const interventionsRes = await fetch("/api/admin/interventions")
        const interventionsData = await interventionsRes.json()

        // Fetch supervisions stats
        const supervisionsRes = await fetch("/api/admin/supervisions")
        const supervisionsData = await supervisionsRes.json()

        setStats({
          gallery: galleryData.images?.length || 0,
          videos: videosData.videos?.length || 0,
          podcasts: podcastsData.podcasts?.length || 0,
          interventions: interventionsData.interventions?.length || 0,
          supervisions: supervisionsData.supervisions?.length || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: "Gallery",
      count: stats.gallery,
      icon: <ImageIcon className="h-8 w-8 text-blue-500" />,
      href: "/admin/dashboard/gallery",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-500",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Videos",
      count: stats.videos,
      icon: <Video className="h-8 w-8 text-purple-500" />,
      href: "/admin/dashboard/videos",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-500",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      title: "Podcasts",
      count: stats.podcasts,
      icon: <Music className="h-8 w-8 text-green-500" />,
      href: "/admin/dashboard/podcasts",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-500",
      gradient: "from-green-500 to-teal-600",
    },
    {
      title: "Interventions",
      count: stats.interventions,
      icon: <Calendar className="h-8 w-8 text-amber-500" />,
      href: "/admin/dashboard/interventions",
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-500",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Supervisions",
      count: stats.supervisions,
      icon: <GraduationCap className="h-8 w-8 text-red-500" />,
      href: "/admin/dashboard/supervisions",
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-500",
      gradient: "from-red-500 to-rose-600",
    },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6 rounded-xl shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Header with search and profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {username}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full md:w-64 bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Content Overview</h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-8 w-24 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {cards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="block bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${card.gradient}`}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${card.color}`}>{card.icon}</div>
                      <div className="text-3xl font-bold text-gray-800">{card.count}</div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                    <div className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      <span>Manage {card.title}</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/admin/dashboard/gallery"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <ImageIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Add New Image</h3>
                    <p className="text-sm text-gray-500">Upload a new image to your gallery</p>
                  </div>
                </Link>

                <Link
                  href="/admin/dashboard/videos"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Add New Video</h3>
                    <p className="text-sm text-gray-500">Add a new video to your collection</p>
                  </div>
                </Link>

                <Link
                  href="/admin/dashboard/podcasts"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Music className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Upload Podcast</h3>
                    <p className="text-sm text-gray-500">Share a new audio podcast</p>
                  </div>
                </Link>

                <Link
                  href="/admin/dashboard/interventions"
                  className="flex items-center p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <div className="p-2 bg-amber-100 rounded-lg mr-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Schedule Intervention</h3>
                    <p className="text-sm text-gray-500">Add a new event to your calendar</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity and Tips */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      Website received <span className="font-medium">24 new visitors</span> today
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      Your <span className="font-medium">publications section</span> was viewed 42 times
                    </p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <Video className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-800">
                      New <span className="font-medium">video content</span> was added to your gallery
                    </p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Tips & Recommendations</h2>
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                  <div className="p-2 bg-indigo-100 rounded-full mr-3 flex-shrink-0">
                    <Settings className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-gray-600">
                      Make sure to update your profile information and change the default password for better security.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full mr-3 flex-shrink-0">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Optimize Your Images</h3>
                    <p className="text-sm text-gray-600">
                      Upload high-quality images with descriptive titles to improve your gallery's appearance and
                      searchability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start p-3 bg-amber-50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-full mr-3 flex-shrink-0">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Keep Your Calendar Updated</h3>
                    <p className="text-sm text-gray-600">
                      Regularly update your interventions and events to keep your audience informed about your
                      activities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
