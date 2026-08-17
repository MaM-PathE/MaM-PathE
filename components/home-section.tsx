"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, GraduationCap, Stethoscope } from "lucide-react"
import { ContactButton } from "@/components/contact-button"
import { scrollToSection } from "@/lib/navigation"

const stats = [
  { icon: <Stethoscope size={18} />, value: "25+", label: "Years of practice" },
  { icon: <Award size={18} />, value: "200+", label: "Publications" },
  { icon: <GraduationCap size={18} />, value: "50+", label: "Fellows trained" },
]

export function HomeSection() {
  return (
    <section className="min-h-screen flex items-center pt-28 pb-20 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-bl-[8rem] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-secondary/5 rounded-tr-[8rem] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text column */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              UCLA Health · Laryngology
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl xl:text-7xl font-serif font-bold text-foreground leading-[1.05] text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Dr. Dinesh K. <span className="text-primary">Chhetri</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-foreground/70 font-serif max-w-xl text-pretty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Professor of Head and Neck Surgery, advancing the science of the human voice and airway.
            </motion.p>

            <motion.p
              className="text-foreground/70 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Internationally recognized expert in laryngology with over 25 years of clinical experience, dedicated to
              research, surgical innovation, and the training of the next generation of surgeons.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Link
                href="#profile"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("profile")
                }}
                className="group inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg shadow-primary/20"
              >
                Discover the profile
                <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <ContactButton />
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-8 max-w-lg border-t border-border/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="pt-6">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    {stat.icon}
                    <span className="text-2xl md:text-3xl font-serif font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-foreground/60 leading-snug">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative w-full max-w-md mx-auto lg:ml-auto aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
              <Image
                src="/professional-headshot.png"
                alt="Portrait of Dr. Dinesh K. Chhetri"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>
            {/* Floating accent card */}
            <motion.div
              className="absolute -bottom-6 -left-4 md:-left-8 bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl border border-border/60 px-5 py-4 max-w-[220px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-sm font-medium text-foreground leading-snug">
                UCLA David Geffen School of Medicine
              </p>
              <p className="text-xs text-foreground/60 mt-1">Head &amp; Neck Surgery</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
