"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { scrollToContactForm } from "@/lib/scroll-utils"
import {
  Menu,
  X,
  Home,
  User,
  BookOpen,
  FileText,
  ImageIcon,
  MessageSquare,
  GraduationCap,
  Headphones,
} from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

interface HeaderProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const handleSectionClick = (section: string) => {
    onSectionChange(section)
    setMobileMenuOpen(false)

    if (section === "contact") {
      // Utiliser notre fonction utilitaire pour le défilement
      setTimeout(() => {
        scrollToContactForm()
      }, 100)
    } else {
      window.location.hash = section
    }
  }

  const navItems = [
    { id: "home", label: "Home", icon: <Home size={18} /> },
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "publications", label: "Publications", icon: <BookOpen size={18} /> },
    { id: "blog", label: "Blog", icon: <FileText size={18} /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon size={18} /> },
    { id: "podcasts", label: "Podcasts", icon: <Headphones size={18} /> },
    { id: "supervisions", label: "Supervision", icon: <GraduationCap size={18} /> },
    { id: "contact", label: "Contact", icon: <MessageSquare size={18} /> },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-xl py-2 border-b border-primary/10" 
          : "bg-background py-6 border-b border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="#home"
            className="text-xl md:text-2xl font-display font-bold tracking-tight text-primary transition-all duration-300 whitespace-nowrap shrink-0 hover:text-primary/80"
            onClick={() => handleSectionClick("home")}
          >
            Dinesh K. Chhetri
          </Link>

          {/* Desktop Navigation — Premium Design */}
          <div className="hidden xl:flex items-center gap-2">
            <nav className="flex items-center bg-card/60 backdrop-blur-xl rounded-2xl shadow-xl px-2 py-2 border border-primary/20 hover:border-primary/40 transition-all duration-300">
              {navItems.map((item, idx) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => handleSectionClick(item.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/8",
                  )}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="ml-3 pl-3 border-l border-border/40">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile / Tablet Menu Button and Theme Toggle */}
          <div className="xl:hidden flex items-center gap-3">
            <ThemeSwitcher />
            <button
              className="p-2.5 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-300 hover:shadow-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay — Premium Premium Design */}
      <div
        className={cn(
          "xl:hidden fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl transition-opacity duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col h-full">
          {/* Overlay top bar — Elevated */}
          <div className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-primary/20 shrink-0">
            <span className="text-lg font-display font-bold text-primary whitespace-nowrap">Dinesh K. Chhetri</span>
            <button
              className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Nav items — Spacious & Premium */}
          <nav className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onClick={() => handleSectionClick(item.id)}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-300",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/8 border border-primary/10 hover:border-primary/30",
                )}
              >
                <span className="flex-shrink-0 transition-transform duration-300">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
