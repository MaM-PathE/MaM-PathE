"use client"

import { useState, useEffect } from "react"
import { Building, Calendar, User, FileText, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface Supervision {
  id: number
  student_name: string
  project_title: string
  institution: string
  period: string
  description?: string
  status: "completed" | "ongoing"
}

export function SupervisionsSection() {
  const [supervisions, setSupervisions] = useState<Supervision[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "completed" | "ongoing">("all")

  useEffect(() => {
    // Données fictives pour les supervisions
    const dummySupervisions: Supervision[] = [
      {
        id: 1,
        student_name: "Dr. Sarah Johnson",
        project_title: "Neural Control of Laryngeal Muscles in Phonation",
        institution: "UCLA School of Medicine",
        period: "2021-2023",
        description:
          "Research on the neurophysiology of laryngeal muscles during various phonation tasks, with implications for treating voice disorders.",
        status: "completed",
      },
      {
        id: 2,
        student_name: "Dr. Michael Chen",
        project_title: "Outcomes of Laryngeal Reinnervation in Unilateral Vocal Fold Paralysis",
        institution: "UCLA Department of Head and Neck Surgery",
        period: "2022-Present",
        description:
          "Clinical study evaluating long-term outcomes of laryngeal reinnervation procedures in patients with unilateral vocal fold paralysis.",
        status: "ongoing",
      },
      {
        id: 3,
        student_name: "Dr. Emily Rodriguez",
        project_title: "Swallowing Function After Chemoradiation for Head and Neck Cancer",
        institution: "UCLA Medical Center",
        period: "2020-2022",
        description:
          "Prospective study of swallowing outcomes in patients undergoing chemoradiation for head and neck cancers, with focus on preventive interventions.",
        status: "completed",
      },
      {
        id: 4,
        student_name: "Dr. James Wilson",
        project_title: "Applications of 3D Printing in Laryngeal Surgery",
        institution: "UCLA Bioengineering Department",
        period: "2022-Present",
        description:
          "Interdisciplinary research on developing 3D-printed models and implants for laryngeal reconstruction surgery.",
        status: "ongoing",
      },
      {
        id: 5,
        student_name: "Dr. Aisha Patel",
        project_title: "Voice Outcomes After Injection Laryngoplasty",
        institution: "UCLA Voice Center",
        period: "2019-2021",
        description:
          "Retrospective analysis of voice outcomes following injection laryngoplasty with different materials for glottic insufficiency.",
        status: "completed",
      },
    ]

    setSupervisions(dummySupervisions)
    setLoading(false)
  }, [])

  const filteredSupervisions = filter === "all" ? supervisions : supervisions.filter((s) => s.status === filter)

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
    <section className="py-24 bg-background" id="supervisions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">Academic Supervision</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Mentoring the next generation of medical researchers and practitioners
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-card/80 backdrop-blur-sm rounded-full shadow-md p-1 border border-border/50">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("ongoing")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === "ongoing"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === "completed"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:text-primary"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredSupervisions.map((supervision) => (
              <motion.div
                key={supervision.id}
                className="bg-card rounded-xl overflow-hidden shadow-md border border-border/50 hover:shadow-lg transition-all duration-300 group"
                variants={item}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-serif font-bold text-foreground line-clamp-1">
                      {supervision.project_title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        supervision.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {supervision.status.charAt(0).toUpperCase() + supervision.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm text-foreground/70">{supervision.student_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm text-foreground/70">{supervision.institution}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm text-foreground/70">{supervision.period}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm text-foreground/70">Research Project</span>
                    </div>
                  </div>

                  {supervision.description && (
                    <p className="text-foreground/70 mb-4 line-clamp-2">{supervision.description}</p>
                  )}

                  <button className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                    View Details
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
