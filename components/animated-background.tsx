"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas: HTMLCanvasElement = canvasRef.current

    const context = canvas.getContext("2d")
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    // Set canvas dimensions to cover the entire document
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1

      // Get the full document height, not just the viewport
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
        window.innerHeight * 2, // Ensure it's at least twice the viewport height
      )

      canvas.width = window.innerWidth * dpr
      canvas.height = documentHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${documentHeight}px`
      ctx.scale(dpr, dpr)
    }

    // Get colors based on theme
    const getThemeColors = () => {
      const currentTheme = resolvedTheme || theme || "light"

      switch (currentTheme) {
        case "light":
          return {
            background: "#ffffff", // white
            particles: "#4361ee", // blue
            connections: "#4361ee", // blue with transparency
          }
        case "dark":
          return {
            background: "#0a1128", // dark blue
            particles: "#4361ee", // bright blue
            connections: "#4cc9f0", // light blue
          }
        case "celestial":
          return {
            background: "#0a1128", // dark blue
            particles: "#4895ef", // medium blue
            connections: "#4cc9f0", // light blue
          }
        case "amethyst":
          return {
            background: "#240046", // dark purple
            particles: "#9d4edd", // medium purple
            connections: "#c77dff", // light purple
          }
        case "verdant":
          return {
            background: "#081c15", // dark green
            particles: "#2d6a4f", // medium green
            connections: "#40916c", // light green
          }
        default: // fallback to light
          return {
            background: "#ffffff", // white
            particles: "#4361ee", // blue
            connections: "#4361ee", // blue with transparency
          }
      }
    }

    let colors = getThemeColors()

    // Soft atmospheric layer: subtle editorial grid and cyan light blooms.
    const drawAtmosphere = () => {
      const width = window.innerWidth
      const height = canvas.height / (window.devicePixelRatio || 1)
      const glow = ctx.createRadialGradient(width * 0.78, height * 0.12, 0, width * 0.78, height * 0.12, Math.min(width, height) * 0.7)
      glow.addColorStop(0, resolvedTheme === "light" ? "rgba(67, 97, 238, 0.12)" : "rgba(76, 201, 240, 0.12)")
      glow.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = resolvedTheme === "light" ? "rgba(67, 97, 238, 0.045)" : "rgba(76, 201, 240, 0.055)"
      ctx.lineWidth = 1
      const grid = 72
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.2
        this.speedY = (Math.random() - 0.5) * 0.2
      }

      update() {
        // Move particle
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = colors.particles
        ctx.fill()
      }
    }

    // Create particles
    const PARTICLE_COUNT = Math.min(Math.floor((canvas.width * canvas.height) / 26000), 90)
    let particles: Particle[] = []

    const initParticles = () => {
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle())
      }
    }

    initParticles()

    // Draw connections between particles
    function drawConnections() {
      const MAX_DISTANCE = 120

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < MAX_DISTANCE) {
            // Calculate opacity based on distance
            const opacity = (1 - distance / MAX_DISTANCE) * (resolvedTheme === "light" ? 0.2 : 0.5)

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = colors.connections
            ctx.globalAlpha = opacity
            ctx.lineWidth = resolvedTheme === "light" ? 0.3 : 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    // Animation loop
    let animationFrameId: number

    function animate() {
      // Clear canvas with background color
      ctx.fillStyle = colors.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawAtmosphere()

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      // Draw connections
      drawConnections()

      // Continue animation
      animationFrameId = requestAnimationFrame(animate)
    }

    // Handle window resize and document height changes
    const handleResize = () => {
      setCanvasDimensions()
      initParticles()
    }

    // Check for document height changes periodically
    const documentHeightInterval = setInterval(() => {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
      )

      if (canvas.height / window.devicePixelRatio < documentHeight) {
        handleResize()
      }
    }, 1000)

    // Handle theme change
    const updateTheme = () => {
      colors = getThemeColors()
    }

    // Add event listener for resize
    window.addEventListener("resize", handleResize)

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      updateTheme()
    })

    observer.observe(document.documentElement, { attributes: true })

    // Initial setup
    setCanvasDimensions()

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
      clearInterval(documentHeightInterval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -10,
        pointerEvents: "none",
      }}
    />
  )
}
