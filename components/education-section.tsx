import { GraduationCap } from "lucide-react"

interface EducationItem {
  degree: string
  institution: string
  period: string
  details?: string
}

const education: EducationItem[] = [
  {
    degree: "Fellowship en Laryngologie",
    institution: "Centre Médical UCLA",
    period: "2003 - 2005",
  },
  {
    degree: "Résidence en Otolaryngologie - Chirurgie de la Tête et du Cou",
    institution: "Centre Médical UCLA",
    period: "1997 - 2003",
  },
  {
    degree: "Doctorat en Médecine (MD)",
    institution: "École de Médecine David Geffen à UCLA",
    period: "1993 - 1997",
    details: "Thèse avec Distinction: Paralysie des Cordes Vocales et Réinnervation Laryngée",
  },
  {
    degree: "Licence en Biochimie (BS)",
    institution: "Université Brown",
    period: "1989 - 1993",
    details: "Magna Cum Laude",
  },
]

export function EducationSection() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-playfair font-semibold mb-6 border-b pb-2">Formation</h2>

      <div className="space-y-8">
        {education.map((item, index) => (
          <div key={index} className="group relative pl-8 transition-all duration-300 hover:translate-x-1">
            <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-background group-hover:border-primary">
              <GraduationCap size={14} className="text-primary/70 group-hover:text-primary" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-medium">{item.degree}</h3>
              <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                <span>{item.institution}</span>
                <span className="text-primary/70">•</span>
                <span>{item.period}</span>
              </div>

              {item.details && <p className="mt-2 text-sm text-muted-foreground italic">{item.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
