import { type NextRequest, NextResponse } from "next/server"
import { getAllSupervisions, addSupervision, initAdminTables } from "@/lib/admin-db"
import { verifyAuth } from "@/lib/middleware"

export async function GET() {
  try {
    const supervisions = await getAllSupervisions()
    return NextResponse.json({ supervisions })
  } catch (error) {
    console.error("Error fetching supervisions:", error)
    return NextResponse.json({ error: "Failed to fetch supervisions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initAdminTables()
    // Vérifier l'authentification JWT
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { student_name, project_title, institution, period, description, status } = data

    // Validation des champs requis
    if (!student_name || typeof student_name !== 'string' || student_name.trim().length === 0) {
      return NextResponse.json({ error: "Student name is required" }, { status: 400 })
    }
    if (!project_title || typeof project_title !== 'string' || project_title.trim().length === 0) {
      return NextResponse.json({ error: "Project title is required" }, { status: 400 })
    }
    if (!institution || typeof institution !== 'string' || institution.trim().length === 0) {
      return NextResponse.json({ error: "Institution is required" }, { status: 400 })
    }
    if (!period || typeof period !== 'string' || period.trim().length === 0) {
      return NextResponse.json({ error: "Period is required" }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedData = {
      student_name: student_name.trim().slice(0, 255),
      project_title: project_title.trim().slice(0, 500),
      institution: institution.trim().slice(0, 255),
      period: period.trim().slice(0, 100),
      description: description ? String(description).trim().slice(0, 2000) : null,
      status: status === "completed" ? "completed" : "ongoing",
    }

    const [newSupervision] = await addSupervision(sanitizedData)

    return NextResponse.json({ success: true, supervision: newSupervision })
  } catch (error) {
    console.error("Error adding supervision:", error)
    return NextResponse.json({ error: "Failed to add supervision" }, { status: 500 })
  }
}
