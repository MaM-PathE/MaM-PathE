"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { GraduationCap, Briefcase, Users, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfileSection() {
  const [activeTab, setActiveTab] = useState("about")

  const tabs = [
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "experience", label: "Experience", icon: <Briefcase className="w-4 h-4" /> },
  ]

  const education = [
    {
      degree: "Fellowship in Laryngology",
      institution: "UCLA Medical Center",
      period: "2003 - 2005",
      details: "Specialized training in advanced voice disorders and airway reconstruction techniques",
    },
    {
      degree: "Residency in Otolaryngology - Head and Neck Surgery",
      institution: "UCLA Medical Center",
      period: "1997 - 2003",
      details: "Comprehensive surgical training with focus on head and neck oncology and reconstructive procedures",
    },
    {
      degree: "Doctor of Medicine (MD)",
      institution: "David Geffen School of Medicine at UCLA",
      period: "1993 - 1997",
      details: "Thesis with Distinction: Vocal Cord Paralysis and Laryngeal Reinnervation",
    },
    {
      degree: "Bachelor of Science in Biochemistry (BS)",
      institution: "Brown University",
      period: "1989 - 1993",
      details: "Magna Cum Laude",
    },
  ]

  const experience = [
    {
      title: "Professor and Vice Chair of Clinical Affairs",
      organization: "Department of Head and Neck Surgery, UCLA",
      period: "2015 - Present",
      description:
        "Supervising clinical and academic operations. Leading NIH-funded research on laryngeal neuromuscular control.",
    },
    {
      title: "Director, UCLA Swallowing Disorders Program",
      organization: "UCLA Health",
      period: "2010 - Present",
      description: "Developing dysphagia prevention protocols for patients undergoing chemoradiation therapy.",
    },
    {
      title: "Co-Director, UCLA Voice Center",
      organization: "UCLA Health",
      period: "2008 - Present",
      description: "Managing care for professional voice users and voice disorders.",
    },
    {
      title: "Surgeon and Laryngologist",
      organization: "UCLA Medical Center",
      period: "2005 - Present",
      description: "Specializing in vocal cord paralysis, airway stenosis, and swallowing disorders.",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden" id="profile">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Profile
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 96 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.p
            className="text-lg text-foreground/70 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Professor and Vice Chair of Clinical Affairs at UCLA's Department of Head and Neck Surgery
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-24"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/professional-headshot.png"
                  alt="Dr. Dinesh K. Chhetri"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif font-bold">Dr. Dinesh K. Chhetri</h3>
                  <p className="text-white/80">Professor of Head and Neck Surgery</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-primary/30 rounded-2xl -z-10"></div>
              <div className="absolute -top-4 -left-4 w-full h-full border-4 border-primary/30 rounded-2xl -z-10"></div>

              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <div className="bg-card rounded-lg p-4 shadow-md border border-border/50 text-center w-[calc(50%-0.5rem)]">
                  <div className="text-3xl font-bold text-primary mb-1">25+</div>
                  <div className="text-sm text-foreground/70">Years Experience</div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow-md border border-border/50 text-center w-[calc(50%-0.5rem)]">
                  <div className="text-3xl font-bold text-primary mb-1">120+</div>
                  <div className="text-sm text-foreground/70">Publications</div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow-md border border-border/50 text-center w-[calc(50%-0.5rem)]">
                  <div className="text-3xl font-bold text-primary mb-1">4000+</div>
                  <div className="text-sm text-foreground/70">Citations</div>
                </div>
                <div className="bg-card rounded-lg p-4 shadow-md border border-border/50 text-center w-[calc(50%-0.5rem)]">
                  <div className="text-3xl font-bold text-primary mb-1">35</div>
                  <div className="text-sm text-foreground/70">H-index</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-card rounded-xl shadow-lg border border-border/50 overflow-hidden">
              <div className="flex border-b border-border/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 font-medium transition-colors",
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-foreground/60 hover:text-primary hover:bg-primary/5",
                    )}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === "about" && (
                  <div>
                    {/* Simplified About section */}
                    <div className="relative">
                      {/* Background decorative elements */}
                      <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-xl -z-10"></div>
                      <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl -z-10"></div>

                      {/* Introduction with quote styling */}
                      <div className="relative mb-10 pl-5 border-l-4 border-primary">
                        <h3 className="text-2xl font-serif font-bold text-primary mb-3">Mission</h3>
                        <p className="text-foreground/80 italic leading-relaxed text-lg">
                          "Advancing patient care through innovative research and education while improving healthcare
                          accessibility worldwide."
                        </p>
                      </div>

                      {/* Main content with enhanced styling */}
                      <div className="space-y-8">
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/30 shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-foreground/80 leading-relaxed text-lg">
                            Dr. Dinesh K. Chhetri is a Professor and Vice Chair of Clinical Affairs at UCLA's Department
                            of Head and Neck Surgery with over 25 years of experience specializing in laryngology and
                            head and neck surgery.
                          </p>
                        </div>

                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/30 shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-foreground/80 leading-relaxed text-lg">
                            His clinical practice focuses on voice disorders, swallowing problems, and airway stenosis.
                            He treats patients with vocal cord paralysis, spasmodic dysphonia, laryngeal cancer, and
                            other disorders affecting voice, swallowing, and breathing.
                          </p>
                        </div>

                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/30 shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-foreground/80 leading-relaxed text-lg">
                            As a researcher, he leads NIH-funded studies on laryngeal neuromuscular control and has
                            published extensively on vocal fold paralysis, laryngeal reinnervation, and dysphagia
                            management. His work has been recognized internationally, contributing to advancements in
                            surgical techniques and patient care.
                          </p>
                        </div>

                        <div className="flex items-center justify-center mt-8">
                          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary">
                            <Globe className="h-5 w-5" />
                            <span className="font-medium">Global impact through research and education</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="space-y-6">
                    {education.map((item, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-6 border-l-2 border-primary/20 last:border-0 last:pb-0"
                      >
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                        <h4 className="text-xl font-serif font-bold text-foreground mb-1">{item.degree}</h4>
                        <div className="flex flex-wrap items-center text-foreground/70 mb-2">
                          <span className="font-medium">{item.institution}</span>
                          <span className="mx-2 text-primary">•</span>
                          <span>{item.period}</span>
                        </div>
                        {item.details && <p className="text-foreground/60 italic">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-6">
                    {experience.map((item, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-6 border-l-2 border-primary/20 last:border-0 last:pb-0"
                      >
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                        <h4 className="text-xl font-serif font-bold text-foreground mb-1">{item.title}</h4>
                        <div className="flex flex-wrap items-center text-foreground/70 mb-2">
                          <span className="font-medium">{item.organization}</span>
                          <span className="mx-2 text-primary">•</span>
                          <span>{item.period}</span>
                        </div>
                        <p className="text-foreground/60">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-32"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif font-bold text-primary text-center mb-16">Areas of Expertise</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-xl p-8 text-center shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Laryngology</h3>
              <p className="text-foreground/70">
                Research on treatment policies for voice and vocal cord disorders for sustainable health development.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 text-center shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Voice Disorders</h3>
              <p className="text-foreground/70">
                Analysis of surgical techniques and medical approaches for voice disorders and vocal cord paralysis.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 text-center shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Clinical Research</h3>
              <p className="text-foreground/70">
                Studies on surgical education, training and skills development in robotic surgery and laryngology.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 text-center shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">Global Training</h3>
              <p className="text-foreground/70">
                Evaluation of public policies and their impact on the development of treatments and surgical procedures.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
