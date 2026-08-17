import { NextResponse } from "next/server"
import { getAllSupervisions } from "@/lib/admin-db"

export const dynamic = "force-dynamic"
export const revalidate = 0

// GET is public - read supervisions
export async function GET() {
  try {
    const supervisions = await getAllSupervisions()
    return NextResponse.json({ supervisions })
  } catch (error) {
    console.error("Error fetching supervisions:", error)
    return NextResponse.json({ error: "Failed to fetch supervisions" }, { status: 500 })
  }
}
