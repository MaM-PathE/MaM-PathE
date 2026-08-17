import { type NextRequest, NextResponse } from "next/server"
import { getAllInterventions, addIntervention } from "@/lib/admin-db"
import { verifyAuth } from "@/lib/middleware"

export async function GET() {
  try {
    const interventions = await getAllInterventions()
    return NextResponse.json({ interventions })
  } catch (error) {
    console.error("Error fetching interventions:", error)
    return NextResponse.json({ error: "Failed to fetch interventions" }, { status: 500 })
  }
}

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

    const data = await request.json()
    const { title, date, location, description, type } = data

    // Validation des champs requis
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: "Date is required" }, { status: 400 })
    }
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }
    if (!type || typeof type !== 'string') {
      return NextResponse.json({ error: "Type is required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      title: title.trim().slice(0, 255),
      date: date.trim(),
      location: location.trim().slice(0, 255),
      description: description ? String(description).trim().slice(0, 2000) : null,
      type: type.trim().slice(0, 50),
    }

    const [newIntervention] = await addIntervention(sanitizedData)

    return NextResponse.json({ success: true, intervention: newIntervention })
  } catch (error) {
    console.error("Error adding intervention:", error)
    return NextResponse.json({ error: "Failed to add intervention" }, { status: 500 })
  }
}
