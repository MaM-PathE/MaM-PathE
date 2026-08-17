"use client"

import { useEffect, useRef } from "react"

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas: HTMLCanvasElement = canvasRef.current

    const context = canvas.getContext("2d")
    if (!context) return
    const ctx: CanvasRenderingContext2D = context

    // Set canvas dimensions
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    // Initialize particles
    let particles: Particle[] = []
    const particleCount = 100
    const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"]
    const maxSize = 4
    const minSize = 1
    const maxSpeed = 0.3
    const connectionDistance = 150
    const connectionOpacity = 0.15

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const mouseRadius = 150
    let mouseActive = false

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      originalX: number
      originalY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.originalX = this.x
        this.originalY = this.y
        this.size = Math.random() * (maxSize - minSize) + minSize
        this.speedX = (Math.random() - 0.5) * maxSpeed
        this.speedY = (Math.random() - 0.5) * maxSpeed
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        // Move particle
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY = -this.speedY
        }

        // Mouse interaction
        if (mouseActive) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius
            this.x += dx * force * 0.05
            this.y += dy * force * 0.05
          }
        }

        // Gentle return to original position
        const dx = this.originalX - this.x
        const dy = this.originalY - this.y
        this.x += dx * 0.01
        this.y += dy * 0.01
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const init = () => {
      resizeCanvas()
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * connectionOpacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      connectParticles()
      requestAnimationFrame(animate)
    }

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      mouseActive = true
    }

    const handleMouseLeave = () => {
      mouseActive = false
    }

    // Touch events
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX
        mouseY = e.touches[0].clientY
        mouseActive = true
      }
    }

    const handleTouchEnd = () => {
      mouseActive = false
    }

    // Event listeners
    window.addEventListener("resize", init)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleTouchEnd)

    // Initialize and start animation
    init()
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", init)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-30" />
}
