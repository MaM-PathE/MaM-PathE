import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { addCourseMaterial, deleteCourseMaterial, getAllCourseMaterials, initAdminTables } from "@/lib/admin-db"
import { verifyAuth } from "@/lib/middleware"

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_TYPES = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

export async function GET() {
  try {
    await initAdminTables()
    return NextResponse.json({ materials: await getAllCourseMaterials() })
  } catch (error) {
    console.error("[Admin Courses] GET failed", error)
    return NextResponse.json({ materials: [], error: "Unable to load materials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.authenticated) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
    await initAdminTables()
    const form = await request.formData()
    const title = String(form.get("title") || "").trim()
    const chapter = String(form.get("chapter") || "").trim() || null
    const description = String(form.get("description") || "").trim() || null
    const materialType = String(form.get("material_type") || "document")
    const videoUrl = String(form.get("video_url") || "").trim() || null
    const file = form.get("file")

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 })
    if (materialType === "video" && !videoUrl) return NextResponse.json({ error: "Video URL is required" }, { status: 400 })

    let fileUrl: string | null = null
    let fileName: string | null = null
    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Unsupported document type" }, { status: 400 })
      if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File too large (20MB max)" }, { status: 400 })
      const blob = await put(file.name, file, { access: "public", addRandomSuffix: true })
      fileUrl = blob.url
      fileName = file.name
    }

    const [material] = await addCourseMaterial({ title: title.slice(0, 255), chapter, description, material_type: materialType, file_url: fileUrl, video_url: videoUrl, file_name: fileName })
    return NextResponse.json({ success: true, material }, { status: 201 })
  } catch (error) {
    console.error("[Admin Courses] POST failed", error)
    return NextResponse.json({ error: "Unable to publish course material" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth.authenticated) return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 })
    const { id } = await request.json()
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Valid material id is required" }, { status: 400 })
    await deleteCourseMaterial(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin Courses] DELETE failed", error)
    return NextResponse.json({ error: "Unable to delete course material" }, { status: 500 })
  }
}
