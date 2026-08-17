export function scrollToSection(sectionId: string) {
  // Fonction simple et directe pour défiler vers une section
  const section = document.getElementById(sectionId)
  if (section) {
    // Utiliser scrollIntoView avec behavior: "smooth" pour un défilement fluide
    section.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}
