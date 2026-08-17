import { type NextRequest, NextResponse } from "next/server"
import { deleteSupervision } from "@/lib/admin-db"
import { verifyAuth } from "@/lib/middleware"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const numericId = Number.parseInt(id, 10)
    
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await deleteSupervision(numericId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting supervision:", error)
    return NextResponse.json({ error: "Failed to delete supervision" }, { status: 500 })
  }
}
