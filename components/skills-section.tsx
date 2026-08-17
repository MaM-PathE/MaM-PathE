"use client"

import { useEffect, useRef } from "react"

const skills = [
  "Laryngologie",
  "Troubles de la Voix",
  "Troubles de la Déglutition",
  "Chirurgie des Voies Respiratoires",
  "Chirurgie Robotique",
  "Recherche Clinique",
  "Formation Mondiale",
  "Subventions NIH",
]

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const skillElements = container.querySelectorAll(".skill-item")

    const positionSkills = () => {
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2
      const radius = Math.min(centerX, centerY) * 0.7

      skillElements.forEach((element, index) => {
        const angle = (index / skillElements.length) * Math.PI * 2
        const x = centerX + radius * Math.cos(angle) - element.clientWidth / 2
        const y = centerY + radius * Math.sin(angle) - element.clientHeight / 2

        const skillElement = element as HTMLElement
        skillElement.style.left = `${x}px`
        skillElement.style.top = `${y}px`
        skillElement.style.opacity = "1"
        skillElement.style.transform = "scale(1)"
      })
    }

    const handleResize = () => {
      positionSkills()
    }

    window.addEventListener("resize", handleResize)
    positionSkills()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-playfair font-semibold mb-6 border-b pb-2">Compétences</h2>

      <div ref={containerRef} className="relative h-[400px] w-full my-8">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="skill-item absolute bg-primary/10 border border-primary/30 rounded-full px-4 py-2 opacity-0 transform scale-0 transition-all duration-500 hover:bg-primary/20 cursor-default"
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  )
}
