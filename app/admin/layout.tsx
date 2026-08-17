import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Dashboard - Dr. Dinesh K. Chhetri",
  description: "Administration dashboard for Dr. Dinesh K. Chhetri's website",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className={`min-h-screen bg-gray-100 ${inter.className}`}>{children}</div>
}
