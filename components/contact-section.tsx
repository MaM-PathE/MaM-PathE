"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const contactDetails = [
  {
    icon: MapPin,
    title: "Address",
    content: (
      <>
        UCLA Head and Neck Surgery
        <br />
        10833 Le Conte Ave
        <br />
        Los Angeles, CA 90095
      </>
    ),
  },
  {
    icon: Mail,
    title: "Email",
    content: (
      <a href="mailto:dchhetri@mednet.ucla.edu" className="hover:text-primary transition-colors">
        dchhetri@mednet.ucla.edu
      </a>
    ),
  },
  {
    icon: Phone,
    title: "Phone",
    content: "(310) 794-4225",
  },
]

export function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setSubmitted(true)
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
      } else if (response.status === 429) {
        setError("Too many requests. Please wait a moment before trying again.")
      } else {
        setError(data?.error || "Something went wrong. Please try again.")
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="pt-32 pb-16" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="section-title mx-auto">Let&apos;s Collaborate</h2>
          <p className="text-lg text-foreground/60 leading-relaxed">
            Interested in working together? I&apos;m always open to discussing research, clinical collaboration, or
            speaking opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact details */}
          <div className="lg:col-span-2 space-y-5">
            {contactDetails.map((item) => (
              <div
                key={item.title}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border/60 hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-card rounded-2xl p-8 shadow-sm border border-border/60">
            {submitted ? (
              <div className="text-center py-16 flex flex-col items-center">
                <CheckCircle2 className="h-14 w-14 text-primary mb-5" />
                <h3 className="text-2xl font-serif font-bold mb-3 text-foreground">Thank you!</h3>
                <p className="text-foreground/60 mb-8 max-w-sm">
                  Your message has been sent successfully. I&apos;ll get back to you as soon as possible.
                </p>
                <Button onClick={() => setSubmitted(false)}>Send another message</Button>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground/80">
                      Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={100}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground/80">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-foreground/80">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    minLength={5}
                    maxLength={200}
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground/80">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    maxLength={5000}
                    placeholder="How can I help you?"
                  />
                </div>

                {error && (
                  <div
                    className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" disabled={submitting} className="w-full flex items-center justify-center">
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
