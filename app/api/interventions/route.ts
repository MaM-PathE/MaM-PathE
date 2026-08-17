import { NextResponse } from "next/server"
import { getAllInterventions } from "@/lib/admin-db"

// GET is public - read interventions
export async function GET() {
  try {
    const interventions = await getAllInterventions()
    return NextResponse.json({ interventions })
  } catch (error) {
    console.error("Error fetching interventions:", error)
    return NextResponse.json({ error: "Failed to fetch interventions" }, { status: 500 })
  }
}
