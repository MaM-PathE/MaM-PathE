import type React from "react"
import type { Metadata } from "next"
import { Inter, Sora, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./theme-provider"
import { InitDB } from "@/components/init-db"

// Premium typography: Inter for body (ultra-readable), Sora for headings (modern & clean)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "600", "700"],
})

// Sophisticated serif fallback for premium accents
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Dr. Dinesh K. Chhetri | Professor of Head and Neck Surgery",
  description: "Internationally recognized expert in laryngology and head and neck surgery at UCLA",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${instrumentSerif.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans antialiased">
        <InitDB />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
