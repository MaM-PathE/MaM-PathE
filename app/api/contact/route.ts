import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { Resend } from "resend"
import { contactSchema, validateInput } from "@/lib/validations"
import { checkRateLimit, getClientIP, contactRateLimit } from "@/lib/rate-limit"

// Configuration des emails (surchargeable par variables d'environnement).
// Par défaut on utilise le domaine de test Resend "onboarding@resend.dev".
// Pour la production : définir CONTACT_FROM_EMAIL avec un domaine vérifié dans Resend.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev"
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "dchhetri@mednet.ucla.edu"

// Sanitize HTML to prevent XSS in emails
function sanitizeForHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>")
}

export async function POST(request: Request) {
  try {
    // CSRF Protection: Valider l'Origin (empêche les POST cross-origin non-autorisées)
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")
    // Autoriser same-origin ou localhost pour dev
    const allowedOrigins = [
      `https://${host}`,
      `http://${host}`,
      "http://localhost:3000",
      "http://localhost:3001",
    ]
    
    if (origin && !allowedOrigins.some((allowed) => origin.includes(allowed.replace(/^https?:\/\//, "")))) {
      return NextResponse.json(
        { error: "CSRF validation failed: Invalid origin" },
        { status: 403 }
      )
    }

    // Rate limiting
    const ip = getClientIP(request)
    const rateLimitResult = checkRateLimit(ip, contactRateLimit)
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many messages sent. Please try again later.",
          retryAfter: rateLimitResult.resetIn 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.resetIn),
          }
        }
      )
    }

    // Parse et valider les entrées avec Zod
    const body = await request.json()
    const validation = validateInput(contactSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    // Enregistrer le message dans la base de données avec paramètres
    const [savedMessage] = await sql`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
      RETURNING id, name, email, subject, created_at
    `

    // Envoyer un email de notification au Dr. Chhetri
    if (process.env.RESEND_API_KEY) {
      try {
        // Instanciation lazy de Resend (uniquement au runtime, jamais au build)
        const resend = new Resend(process.env.RESEND_API_KEY)

        // Sanitize for HTML email
        const safeName = sanitizeForHtml(name)
        const safeEmail = sanitizeForHtml(email)
        const safeSubject = sanitizeForHtml(subject)
        const safeMessage = sanitizeForHtml(message)

        await resend.emails.send({
          from: FROM_EMAIL,
          to: TO_EMAIL,
          replyTo: email,
          subject: `New Contact Message: ${subject.slice(0, 50)}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0f4c81;">New Message from Website</h2>
              <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
              <p><strong>Subject:</strong> ${safeSubject}</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p>${safeMessage}</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                This message was sent from the contact form on your website.
              </p>
            </div>
          `,
        })

        // Envoyer un email de confirmation à l'expéditeur
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Thank you for your message to Dr. Dinesh K. Chhetri",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0f4c81;">Thank You for Your Message</h2>
              <p>Dear ${safeName},</p>
              <p>Thank you for contacting Dr. Dinesh K. Chhetri. Your message has been received and will be reviewed shortly.</p>
              <p>We will get back to you as soon as possible.</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p><strong>Your message:</strong></p>
                <p>${safeMessage}</p>
              </div>
              <p style="margin-top: 30px;">Best regards,</p>
              <p><strong>Dr. Dinesh K. Chhetri</strong><br>
              Professor of Head and Neck Surgery<br>
              UCLA Medical Center</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error("Error sending email:", emailError)
        // Continue even if email fails - message is saved in DB
      }
    }

    return NextResponse.json({
      message: "Message sent successfully",
      data: { id: savedMessage.id },
    })
  } catch (error) {
    console.error("Error in contact API:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
