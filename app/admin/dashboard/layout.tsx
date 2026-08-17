"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Home, ImageIcon, Video, Music, Calendar, GraduationCap, LogOut, Menu, X, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()

        if (!data.authenticated) {
          router.push("/admin")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/admin/dashboard/gallery", label: "Gallery", icon: <ImageIcon className="h-5 w-5" /> },
    { href: "/admin/dashboard/videos", label: "Videos", icon: <Video className="h-5 w-5" /> },
    { href: "/admin/dashboard/podcasts", label: "Podcasts", icon: <Music className="h-5 w-5" /> },
    { href: "/admin/dashboard/blog", label: "Blog", icon: <FileText className="h-5 w-5" /> },
    { href: "/admin/dashboard/interventions", label: "Interventions", icon: <Calendar className="h-5 w-5" /> },
    { href: "/admin/dashboard/supervisions", label: "Supervisions", icon: <GraduationCap className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="bg-white">
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>{user?.username}</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  pathname === item.href ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
