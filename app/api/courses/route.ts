import { NextResponse } from "next/server"
import { getAllCourseMaterials, initAdminTables } from "@/lib/admin-db"

export async function GET() {
  try {
    await initAdminTables()
    const materials = await getAllCourseMaterials()
    return NextResponse.json({ materials })
  } catch (error) {
    console.error("[Courses API] GET failed", error)
    return NextResponse.json({ materials: [], error: "Unable to load course materials" }, { status: 500 })
  }
}
