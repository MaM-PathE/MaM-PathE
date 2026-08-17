"use client"

import { Button } from "@/components/ui/button"

export function CollaborateContactButton() {
  // Simplifier radicalement la fonction handleClick

  const handleClick = () => {
    console.log("Collaborate contact button clicked - simplified version")

    // Mettre à jour l'URL avec le hash
    window.location.hash = "contact"

    // Faire défiler vers le bas de la page
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    }, 100)
  }

  return (
    <Button
      onClick={handleClick}
      className="
        relative px-8 py-3 rounded-full
        bg-indigo-600 text-white font-medium
        shadow-lg hover:shadow-indigo-500/30
        transform hover:scale-105
        transition-all duration-300
        before:content-[''] before:absolute before:inset-0
        before:rounded-full before:border-2 before:border-indigo-400
        before:scale-[1.15] before:opacity-0 hover:before:scale-105
        hover:before:opacity-100 before:transition-all before:duration-300
      "
    >
      Contact Me
    </Button>
  )
}
