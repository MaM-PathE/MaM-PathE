"use client"

import { Book, Briefcase, GraduationCap, FileText } from "lucide-react"

export function ExpertiseSection() {
  const expertiseAreas = [
    {
      title: "Laryngology",
      icon: <Book className="w-8 h-8" />,
      description:
        "Research on treatment policies for voice and vocal cord disorders for sustainable health development.",
    },
    {
      title: "Voice Disorders",
      icon: <Briefcase className="w-8 h-8" />,
      description: "Analysis of employment dynamics of surgical techniques and medical labor market policies.",
    },
    {
      title: "Robotic Surgery",
      icon: <GraduationCap className="w-8 h-8" />,
      description: "Studies on surgical education, training and skills development in robotic surgery.",
    },
    {
      title: "Clinical Research",
      icon: <FileText className="w-8 h-8" />,
      description:
        "Evaluation of public policies and their impact on the development of treatments and surgical procedures.",
    },
  ]

  return (
    <section className="section-spacing" id="expertise">
      <div className="container-custom">
        <h2 className="section-title text-center mx-auto">Areas of Expertise</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {expertiseAreas.map((area, index) => (
            <div key={index} className="expertise-card animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="expertise-icon">{area.icon}</div>
              <h3 className="text-xl font-playfair font-bold text-center mb-3">{area.title}</h3>
              <p className="text-gray-600 text-center">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
