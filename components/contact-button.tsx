"use client"

import type React from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface ContactButtonProps extends ButtonProps {
  children?: React.ReactNode
}

export function ContactButton({ children, className = "", ...props }: ContactButtonProps) {
  // Simplifier radicalement la fonction handleClick

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Contact button clicked - simplified version")

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
      className={`
        relative overflow-hidden group
        bg-transparent border-2 border-primary
        text-primary font-medium
        hover:bg-primary hover:text-white
        transition-all duration-300 ease-in-out
        rounded-full px-6 py-2
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-[-8px]">
        {children || "Contact Me"}
        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute right-0 transform translate-x-[-16px] group-hover:translate-x-0" />
      </span>
    </Button>
  )
}
