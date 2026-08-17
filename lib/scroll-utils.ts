/**
 * Fonction pour faire défiler vers une section spécifique
 * @param sectionId - L'ID de la section cible
 */
export function scrollToSection(sectionId: string) {
  try {
    // Vérifier si nous sommes dans un environnement navigateur
    if (typeof window === "undefined") return

    console.log(`Attempting to scroll to section: #${sectionId}`)

    // Mettre à jour l'URL avec le hash
    window.location.hash = sectionId

    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
      // Trouver l'élément cible
      const targetSection = document.getElementById(sectionId)

      if (targetSection) {
        console.log(`Found section: #${sectionId}`)

        // Faire défiler vers la section
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        console.warn(`Section not found: #${sectionId}`)
      }
    }, 100)
  } catch (error) {
    console.error(`Error scrolling to section #${sectionId}:`, error)
  }
}

/**
 * Fonction simplifiée pour faire défiler vers le formulaire de contact
 */
export function scrollToContactForm() {
  try {
    // Vérifier si nous sommes dans un environnement navigateur
    if (typeof window === "undefined") return

    console.log("Scrolling to contact form - simplified version")

    // Mettre à jour l'URL avec le hash
    window.location.hash = "contact"

    // Forcer un rafraîchissement de la page pour s'assurer que la section contact est visible
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    }, 100)
  } catch (error) {
    console.error("Error scrolling to contact form:", error)
  }
}
