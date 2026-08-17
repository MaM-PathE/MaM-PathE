import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET est public - lecture des vidéos
export async function GET() {
  try {
    const videos = await sql`
      SELECT id, title, embed_url, category, thumbnail_url, created_at 
      FROM videos 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}
