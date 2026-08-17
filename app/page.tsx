"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { HomeSection } from "@/components/home-section"
import { ProfileSection } from "@/components/profile-section"
import { PublicationsSection } from "@/components/publications-section"
import { LecturesSection } from "@/components/lectures-section"
import { BlogSection } from "@/components/blog-section"
import { MediaSection } from "@/components/media-section"
import { SupervisionsSection } from "@/components/supervisions-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { PodcastsSection } from "@/components/podcasts-section"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    // Handle hash changes for direct navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        setActiveSection(hash)
      }
    }

    // Check for hash on initial load
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />

      <div id="home" className={activeSection === "home" ? "block" : "hidden"}>
        <HomeSection />
      </div>

      <div id="profile" className={activeSection === "profile" ? "block" : "hidden"}>
        <ProfileSection />
      </div>

      <div id="publications" className={activeSection === "publications" ? "block" : "hidden"}>
        <PublicationsSection />
      </div>

      <div id="lectures" className={activeSection === "lectures" ? "block" : "hidden"}>
        <LecturesSection />
      </div>

      <div id="blog" className={activeSection === "blog" ? "block" : "hidden"}>
        <BlogSection />
      </div>

      <div id="gallery" className={activeSection === "gallery" ? "block" : "hidden"}>
        <MediaSection />
      </div>

      <div id="podcasts" className={activeSection === "podcasts" ? "block" : "hidden"}>
        <PodcastsSection />
      </div>

      <div id="supervisions" className={activeSection === "supervisions" ? "block" : "hidden"}>
        <SupervisionsSection />
      </div>

      <div
        id="contact"
        className={activeSection === "contact" ? "block" : "hidden"}
        style={{ scrollMarginTop: "100px" }}
      >
        <ContactSection />
      </div>

      <Footer />
    </main>
  )
}
