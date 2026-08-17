"use client"

import { useState } from "react"
import { ArrowRight, FileText, Calendar, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function PublicationsSection() {
  const [showAll, setShowAll] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const publications = [
    {
      category: "Laryngology",
      title: "Total tracheoesophageal puncture failure: A scoping review of patient characteristics and etiologies",
      authors: "Shaghauyegh S Azar, Courtney B Shires, Karuna Dewan, Dinesh K Chhetri",
      journal: "Head & Neck",
      year: "2024",
      link: "https://pubmed.ncbi.nlm.nih.gov/39077940/",
    },
    {
      category: "Clinical",
      title: "Heterogeneous Presentations and Serologies in Myasthenia Gravis Patients Presenting with Dysphagia",
      authors: "Clare Moffatt, Pranati Pillutla, Payam Soltanzadeh, Dinesh K Chhetri",
      journal: "Dysphagia",
      year: "2024",
      link: "https://pubmed.ncbi.nlm.nih.gov/38949061/",
    },
    {
      category: "Surgery",
      title: "Contemporary Surgical Approaches in Managing Laryngeal Chondrosarcoma: A Scoping Review",
      authors: "D Alexander Cronkite, Clare Moffatt, Kenric Tam, Alice C Yu, Dinesh K Chhetri, Maie St John",
      journal: "Laryngoscope",
      year: "2024",
      link: "https://pubmed.ncbi.nlm.nih.gov/39968575/",
    },
    {
      category: "Surgery",
      title: "What Is the Role of Laryngeal Reinnervation Surgery for Adults With Unilateral Vocal Fold Paralysis?",
      authors: "Pranati Pillutla, Kirsten Meenan, Dinesh K Chhetri",
      journal: "Laryngoscope",
      year: "2023",
      link: "https://pubmed.ncbi.nlm.nih.gov/36757023/",
    },
    {
      category: "Research",
      title: "Control of Pre-phonatory Glottal Shape by Intrinsic Laryngeal Muscles",
      authors: "Pranati Pillutla, Neha K Reddy, Patrick Schlegel, Zhaoyan Zhang",
      journal: "Laryngoscope",
      year: "2022",
      link: "https://pubmed.ncbi.nlm.nih.gov/36129162/",
    },
    {
      category: "Clinical",
      title: "Reinke's Edema: Management and Voice Outcomes",
      authors: "Karuna Dewan, Dinesh K Chhetri, Henry Hoffman",
      journal: "Laryngoscope Investigative Otolaryngology",
      year: "2022",
      link: "https://pubmed.ncbi.nlm.nih.gov/36000026/",
    },
    {
      category: "Research",
      title: "Phonation Threshold Pressure Revisited: Effects of Intrinsic Laryngeal Muscle Activation",
      authors: "Shaghauyegh S Azar, Dinesh K Chhetri",
      journal: "Journal of Voice",
      year: "2021",
      link: "https://pubmed.ncbi.nlm.nih.gov/34784055/",
    },
    {
      category: "Oncology",
      title: "Cancer of the Larynx and Hypopharynx",
      authors: "Kristen A Echanique, Lauran K Evans, Albert Y Han, Dinesh K Chhetri, Maie A St John",
      journal: "Surgical Oncology Clinics of North America",
      year: "2021",
      link: "https://pubmed.ncbi.nlm.nih.gov/34272102/",
    },
    {
      category: "Research",
      title: "Perceptual Evaluation of Vocal Fold Vibratory Asymmetry",
      authors: "Shaghauyegh S Azar, Pranati Pillutla, Lauran K Evans, Zhaoyan Zhang, Jody Kreiman, Dinesh K Chhetri",
      journal: "Laryngoscope",
      year: "2021",
      link: "https://pubmed.ncbi.nlm.nih.gov/34106487/",
    },
  ]

  const allPublications = [
    ...publications,
    {
      category: "Case Report",
      title: "Delayed Tracheal Perforation After Partial Thyroidectomy: A Case Report and Review of the Literature",
      authors: "Shaghauyegh S Azar, Evan Patel, Lauran K Evans, Timothy C Blood, Brooke M Su-Velez, Dinesh K Chhetri",
      journal: "Ear, Nose, & Throat Journal",
      year: "2021",
      link: "https://pubmed.ncbi.nlm.nih.gov/34030512/",
    },
    {
      category: "Education",
      title: "Flexible Bronchoscopy Simulation as a Tool to Improve Surgical Skills in Otolaryngology Residency",
      authors: "Santa Maria PL, Chhetri DK, et al.",
      journal: "Laryngoscope Investigative Otolaryngology",
      year: "2021",
      link: "https://pubmed.ncbi.nlm.nih.gov/33937524/",
    },
    {
      category: "Clinical",
      title: "Contrast-Induced Sialadenitis of the Sublingual Glands",
      authors: "Ki Wan Park, Albert Y Han, Christine M Kim, Kenric Tam, Dinesh K Chhetri",
      journal: "Ear, Nose, & Throat Journal",
      year: "2020",
      link: "https://pubmed.ncbi.nlm.nih.gov/32963864/",
    },
    {
      category: "Clinical",
      title: "Triological Best Practice: When Is Surgical Intervention Indicated for Vocal Fold Leukoplakia?",
      authors: "Christine M Kim, Dinesh K Chhetri",
      journal: "Laryngoscope",
      year: "2020",
      link: "https://pubmed.ncbi.nlm.nih.gov/32034947/",
    },
    {
      category: "Research",
      title: "BAGLS, a multihospital Benchmark for Automatic Glottis Segmentation",
      authors: "Pablo Gómez, Andreas M Kist, Patrick Schlegel, David A Berry, Dinesh K Chhetri, et al.",
      journal: "Scientific Reports",
      year: "2020",
      link: "https://pubmed.ncbi.nlm.nih.gov/32561845/",
    },
    {
      category: "Research",
      title: "Dynamics of Intrinsic Laryngeal Muscle Contraction",
      authors: "Andrew M Vahabzadeh-Hagh, Pranati Pillutla, Zhaoyan Zhang, Dinesh K Chhetri",
      journal: "Laryngoscope",
      year: "2019",
      link: "https://pubmed.ncbi.nlm.nih.gov/30325497/",
    },
    {
      category: "Clinical",
      title: "Catathrenia (Nocturnal Groaning): A Social Media Survey and State-of-the-Art Review",
      authors: "Jose Alonso, Macario Camacho, Dinesh K Chhetri, Christian Guilleminault, Soroush Zaghi",
      journal: "Journal of Clinical Sleep Medicine",
      year: "2017",
      link: "https://pubmed.ncbi.nlm.nih.gov/28095968/",
    },
    {
      category: "Surgery",
      title: "Endoscopic Management of Subglottic Stenosis",
      authors:
        "Aaron J Feinstein, Alex Goel, Govind Raghavan, Jennifer Long, Dinesh K Chhetri, Gerald S Berke, Abie H Mendelsohn",
      journal: "JAMA Otolaryngology--Head & Neck Surgery",
      year: "2017",
      link: "https://pubmed.ncbi.nlm.nih.gov/28241174/",
    },
    {
      category: "Research",
      title: "Tissue engineering. Restoring voice",
      authors: "Jennifer L Long, Dinesh K Chhetri",
      journal: "Science",
      year: "2015",
      link: "https://pubmed.ncbi.nlm.nih.gov/26586745/",
    },
    {
      category: "Clinical",
      title: "Superior laryngeal nerve injury: effects, clinical findings, prognosis, and management options",
      authors: "Michael I Orestes, Dinesh K Chhetri",
      journal: "Current Opinion in Otolaryngology & Head and Neck Surgery",
      year: "2014",
      link: "https://pubmed.ncbi.nlm.nih.gov/25136863/",
    },
    {
      category: "Surgery",
      title: "Percutaneous injection laryngoplasty",
      authors: "Dinesh K Chhetri, Nausheen Jamal",
      journal: "Laryngoscope",
      year: "2014",
      link: "https://pubmed.ncbi.nlm.nih.gov/24114620/",
    },
    {
      category: "Case Report",
      title: "Viral Supraglottitis in an Adult",
      authors: "Lotfizadeh A, Chhetri DK",
      journal: "Laryngoscope",
      year: "2009",
      link: "https://pubmed.ncbi.nlm.nih.gov/19598214/",
    },
    {
      category: "Clinical",
      title: "Hyaluronic acid for the treatment of vocal fold scars",
      authors: "Dinesh K Chhetri, Abie H Mendelsohn",
      journal: "Current Opinion in Otolaryngology & Head and Neck Surgery",
      year: "2010",
      link: "https://pubmed.ncbi.nlm.nih.gov/20856119/",
    },
    {
      category: "Case Report",
      title: "Isolated uvulitis",
      authors: "Marc Cohen, Dinesh K Chhetri, Christian Head",
      journal: "Western Journal of Emergency Medicine",
      year: "2007",
      link: "https://pubmed.ncbi.nlm.nih.gov/17915667/",
    },
  ]

  const displayPublications = showAll ? allPublications : publications

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
    <section className="py-24 bg-background" id="publications">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary">Recent Publications</h2>
          <Button
            className="bg-background hover:bg-background/90 text-primary border border-primary flex items-center gap-2"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                Show less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show more <ChevronDown size={16} />
              </>
            )}
          </Button>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {displayPublications.slice(0, expanded ? displayPublications.length : 9).map((pub, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-lg overflow-hidden shadow-md border border-border/50 hover:shadow-lg transition-all duration-300"
              variants={item}
            >
              <div className="p-6">
                <div className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-3">
                  {pub.category}
                </div>
                <h3 className="font-serif font-bold text-xl mb-3 line-clamp-2">{pub.title}</h3>
                <p className="text-foreground/70 text-sm mb-4 line-clamp-1">{pub.authors}</p>
                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <div className="flex items-center">
                    <FileText size={14} className="mr-1" />
                    {pub.journal}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {pub.year}
                  </div>
                </div>
              </div>
              <div className="border-t border-border/50 p-4">
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium hover:text-primary/80 transition-colors flex items-center"
                >
                  View Publication <ArrowRight size={14} className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {!expanded && (
          <div className="mt-16 text-center">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-md flex items-center mx-auto text-lg"
              onClick={() => setShowAll(true)}
            >
              View All Publications <ExternalLink size={18} className="ml-2" />
            </Button>
          </div>
        )}

        {showAll && (
          <div className="mt-16 text-center">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/?term=Chhetri+DK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink size={16} />
              <span className="font-medium">View complete publication list on PubMed</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
