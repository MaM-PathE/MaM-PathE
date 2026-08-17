interface ExperienceItem {
  title: string
  organization: string
  period: string
  description: string
}

const experiences: ExperienceItem[] = [
  {
    title: "Professor and Interim Chair of Clinical Affairs",
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

export function ExperienceSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-light mb-8 inline-block border-b border-white/20 pb-2">Experience</h2>

        <div className="space-y-8">
          {experiences.map((item, index) => (
            <div key={index} className="group">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-2">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <div className="text-white/50 text-sm">
                  {item.organization} • {item.period}
                </div>
              </div>
              <p className="text-white/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
