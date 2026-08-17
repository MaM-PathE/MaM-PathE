import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { del } from "@vercel/blob"
import { verifyAuth } from "@/lib/middleware"

// DELETE est protégé - suppression d'un podcast (JWT requis)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Vérifier l'authentification JWT
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const podcastId = Number.parseInt(id, 10)
    if (Number.isNaN(podcastId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    // Récupérer le podcast pour retrouver l'URL du fichier audio
    const [podcast] = await sql`
      SELECT id, audio_url FROM podcasts WHERE id = ${podcastId}
    `

    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 })
    }

    // Supprimer le fichier audio du Blob storage (best-effort)
    if (podcast.audio_url) {
      try {
        await del(podcast.audio_url)
      } catch (blobError) {
        console.error("Error deleting audio blob:", blobError)
        // On continue même si la suppression du blob échoue
      }
    }

    await sql`DELETE FROM podcasts WHERE id = ${podcastId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting podcast:", error)
    return NextResponse.json({ error: "Failed to delete podcast" }, { status: 500 })
  }
}
