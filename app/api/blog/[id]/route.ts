import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { checkAuth } from "@/lib/middleware"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérifier l'authentification
    const authCheck = await checkAuth()
    if (!authCheck.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await sql`DELETE FROM blog_posts WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
