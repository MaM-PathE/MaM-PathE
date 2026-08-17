interface ResearchItem {
  title: string
  description: string
}

const researchAreas: ResearchItem[] = [
  {
    title: "Laryngeal Neuromuscular Control",
    description:
      "Investigating the neural mechanisms controlling vocal fold movement and their implications for voice disorders.",
  },
  {
    title: "Vocal Fold Paralysis Treatment",
    description: "Developing novel approaches for reinnervation and rehabilitation of paralyzed vocal folds.",
  },
  {
    title: "Dysphagia Management",
    description: "Researching innovative diagnostic and therapeutic strategies for swallowing disorders.",
  },
  {
    title: "Airway Stenosis",
    description: "Exploring minimally invasive techniques for treating airway narrowing and obstruction.",
  },
  {
    title: "Voice Science",
    description: "Studying the biomechanics and acoustics of voice production in normal and pathological conditions.",
  },
]

export function ResearchSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-light mb-8 inline-block border-b border-white/20 pb-2">Research</h2>

        <div className="space-y-6">
          {researchAreas.map((item, index) => (
            <div key={index} className="group">
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-white/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
