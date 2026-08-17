"use client"

import { Mail, MapPin, Phone, Twitter, Music, Headphones, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { ContactButton } from "@/components/contact-button"
import { scrollToContactForm } from "@/lib/scroll-utils"
import { useState, useEffect } from "react"
import { TerminalSignature } from "@/components/terminal-signature"

export function Footer() {
  const [recentPodcasts, setRecentPodcasts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("/api/podcasts")
        const data = await response.json()
        setRecentPodcasts(data.podcasts?.slice(0, 3) || [])
      } catch (error) {
        console.error("Error fetching podcasts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPodcasts()
  }, [])

  const scrollToSection = (id: string) => {
    if (id === "contact") {
      scrollToContactForm()
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="relative">
      {/* Section "Let's Collaborate" directement sur le fond d'écran */}
      <section className="py-24 relative overflow-hidden">
        <motion.div
          className="max-w-3xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl font-serif font-bold text-primary mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
          >
            Let's Collaborate
          </motion.h2>

          <motion.p
            className="text-foreground/80 text-lg mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Interested in my research or would you like to collaborate on a project? Feel free to contact me to discuss
            collaboration opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <ContactButton className="px-8 py-4 text-lg shadow-lg hover:shadow-xl" />
          </motion.div>
        </motion.div>
      </section>

      {/* Vague SVG au-dessus du footer - version plus douce */}
      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            fill="hsl(var(--primary))"
            fillOpacity="1"
            d="M0,32L80,37.3C160,43,320,53,480,58.7C640,64,800,64,960,58.7C1120,53,1280,43,1360,37.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Contenu principal du footer avec effet de vague */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Première colonne - À propos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h3 className="font-serif font-bold text-2xl mb-6 text-white">Dr. Dinesh K. Chhetri</h3>
              <p className="mb-6 text-primary-foreground/90 text-lg">
                Professor of Head and Neck Surgery at UCLA Medical Center.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://x.com/voiceboxdoc"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20"
                  aria-label="X"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://instagram.com/voiceboxdoc?igsh=dTh1bGpxM3dwMWlp"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </motion.div>

            {/* Deuxième colonne - Liens rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h3 className="font-serif font-bold text-2xl mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { id: "profile", label: "Profile" },
                  { id: "publications", label: "Publications" },
                  { id: "blog", label: "Blog" },
                  { id: "gallery", label: "Gallery" },
                  { id: "contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(link.id)
                      }}
                      className="text-primary-foreground/80 hover:text-white transition-colors text-base flex items-center"
                    >
                      <span className="mr-2">→</span> {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Troisième colonne - Podcasts récents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h3 className="font-serif font-bold text-2xl mb-6 text-white">Recent Podcasts</h3>
              {loading ? (
                <p className="text-primary-foreground/80">Loading podcasts...</p>
              ) : recentPodcasts.length > 0 ? (
                <ul className="space-y-4">
                  {recentPodcasts.map((podcast) => (
                    <li key={podcast.id} className="flex items-start">
                      <div className="mr-3 mt-1 bg-primary-foreground/10 p-1 rounded-full flex-shrink-0">
                        <Headphones size={16} className="text-primary-foreground" />
                      </div>
                      <div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToSection("podcasts")
                          }}
                          className="text-primary-foreground hover:text-white transition-colors text-sm font-medium"
                        >
                          {podcast.title}
                        </a>
                        <p className="text-primary-foreground/60 text-xs">{formatDate(podcast.created_at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center text-primary-foreground/80">
                  <Music className="mr-2" size={18} />
                  <span>No podcasts available yet</span>
                </div>
              )}
              <div className="mt-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("podcasts")
                  }}
                  className="text-white hover:text-primary-foreground/80 transition-colors text-sm inline-flex items-center"
                >
                  View all podcasts
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Quatrième colonne - Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="footer-column"
            >
              <h3 className="font-serif font-bold text-2xl mb-6 text-white">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="mr-3 bg-primary-foreground/10 p-2 rounded-full flex-shrink-0">
                    <MapPin size={18} className="text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground/90 text-sm">Los Angeles, CA 90095, USA</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-primary-foreground/10 p-2 rounded-full flex-shrink-0">
                    <Mail size={18} className="text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground/90 text-sm">dchhetri@mednet.ucla.edu</span>
                </li>
                <li className="flex items-center">
                  <div className="mr-3 bg-primary-foreground/10 p-2 rounded-full flex-shrink-0">
                    <Phone size={18} className="text-primary-foreground" />
                  </div>
                  <span className="text-primary-foreground/90 text-sm">(310) 794-4225</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Terminal signature */}
          <TerminalSignature />
        </div>
      </footer>
    </div>
  )
}
