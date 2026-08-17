"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface Intervention {
  id: number
  title: string
  date: string
  location: string
  type: string
  description?: string
  link?: string
}

export function InterventionsSection() {
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Données fictives pour les interventions
    const dummyInterventions: Intervention[] = [
      {
        id: 1,
        title: "Keynote Speaker: Advances in Laryngeal Reinnervation",
        date: "2023-12-15",
        location: "American Academy of Otolaryngology Annual Meeting, Boston, MA",
        type: "conference",
        description: "Presenting the latest research findings on laryngeal reinnervation techniques and outcomes.",
        link: "#",
      },
      {
        id: 2,
        title: "Surgical Workshop: Transoral Robotic Surgery",
        date: "2024-02-10",
        location: "UCLA Medical Center, Los Angeles, CA",
        type: "workshop",
        description: "Hands-on training for otolaryngology residents on transoral robotic surgical techniques.",
        link: "#",
      },
      {
        id: 3,
        title: "Guest Lecturer: Voice Disorders in Professional Singers",
        date: "2024-03-22",
        location: "Johns Hopkins University, Baltimore, MD",
        type: "lecture",
        description: "Discussing diagnosis and management of voice disorders specific to professional singers.",
        link: "#",
      },
      {
        id: 4,
        title: "International Symposium on Laryngology",
        date: "2024-05-05",
        location: "Royal College of Surgeons, London, UK",
        type: "conference",
        description: "Panel discussion on emerging technologies in laryngeal surgery.",
        link: "#",
      },
    ]

    setInterventions(dummyInterventions)
    setLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "conference":
        return "bg-blue-100 text-blue-800"
      case "workshop":
        return "bg-green-100 text-green-800"
      case "lecture":
        return "bg-purple-100 text-purple-800"
      case "surgery":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
    <section className="py-24 bg-gradient-to-b from-background to-muted/20" id="interventions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">Interventions & Events</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Upcoming and recent speaking engagements, workshops, and conferences
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex gap-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {interventions.map((intervention) => (
              <motion.div
                key={intervention.id}
                className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 hover:shadow-lg transition-all duration-300 group"
                variants={item}
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <h3 className="text-xl font-serif font-bold text-foreground">{intervention.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(intervention.type)}`}>
                      {intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-foreground/70 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      {formatDate(intervention.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {intervention.location}
                    </div>
                  </div>

                  {intervention.description && <p className="text-foreground/70 mb-4">{intervention.description}</p>}

                  {intervention.link && (
                    <a
                      href={intervention.link}
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                    >
                      More Information
                      <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
