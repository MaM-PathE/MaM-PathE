import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { put } from "@vercel/blob"
import { verifyAuth } from "@/lib/middleware"

// GET est public - lecture des podcasts
export async function GET() {
  try {
    const podcasts = await sql`
      SELECT id, title, description, audio_url, created_at
      FROM podcasts
      ORDER BY created_at DESC
    `

    return NextResponse.json({ podcasts })
  } catch (error) {
    console.error("Error fetching podcasts:", error)
    return NextResponse.json({ error: "Failed to fetch podcasts" }, { status: 500 })
  }
}

// POST est protégé - création de podcasts (authentification JWT requise)
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification JWT
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = (formData.get("title") as string)?.trim()
    const description = ((formData.get("description") as string) || "").trim()
    const audio = formData.get("audio") as File | null

    // Validation des entrées
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (title.length > 200) {
      return NextResponse.json({ error: "Title is too long (max 200 characters)" }, { status: 400 })
    }
    if (description.length > 2000) {
      return NextResponse.json({ error: "Description is too long (max 2000 characters)" }, { status: 400 })
    }
    if (!audio || audio.size === 0) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 })
    }

    // Vérifier le type de fichier audio
    const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/webm"]
    if (!allowedTypes.includes(audio.type)) {
      return NextResponse.json(
        { error: "Invalid audio type. Allowed: MP3, WAV, M4A, AAC, OGG" },
        { status: 400 },
      )
    }

    // Vérifier la taille (max 100MB)
    if (audio.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio file too large (max 100MB)" }, { status: 400 })
    }

    const blob = await put(audio.name, audio, {
      access: "public",
      addRandomSuffix: true,
    })

    const [podcast] = await sql`
      INSERT INTO podcasts (title, audio_url, description)
      VALUES (${title}, ${blob.url}, ${description || null})
      RETURNING id, title, description, audio_url, created_at
    `

    return NextResponse.json({ podcast })
  } catch (error) {
    console.error("Error creating podcast:", error)
    return NextResponse.json({ error: "Failed to create podcast" }, { status: 500 })
  }
}
