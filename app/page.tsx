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
  const sectionVisibility = (section: string) => (activeSection === section ? "block" : "hidden")

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) setActiveSection(hash)
    }

    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className={sectionVisibility("home")}>
        <HomeSection onSectionChange={(section) => {
        setActiveSection(section)
        window.location.hash = section
        }} />
      </div>

      <div id="profile" className={sectionVisibility("profile")}>
        <ProfileSection />
      </div>

      <div id="publications" className={sectionVisibility("publications")}>
        <PublicationsSection />
      </div>

      <div id="lectures" className={sectionVisibility("lectures")}>
        <LecturesSection />
      </div>

      <div id="blog" className={sectionVisibility("blog")}>
        <BlogSection />
      </div>

      <div id="gallery" className={sectionVisibility("gallery")}>
        <MediaSection />
      </div>

      <div id="podcasts" className={sectionVisibility("podcasts")}>
        <PodcastsSection />
      </div>

      <div id="supervisions" className={sectionVisibility("supervisions")}>
        <SupervisionsSection />
      </div>

      <div
        id="contact"
        className={sectionVisibility("contact")}
        style={{ scrollMarginTop: "100px" }}
      >
        <ContactSection />
      </div>

      <Footer />
    </main>
  )
}
