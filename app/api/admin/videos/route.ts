import { type NextRequest, NextResponse } from "next/server"
import { getAllVideos, addVideo, deleteVideo, initAdminTables } from "@/lib/admin-db"
import { verifyAuth } from "@/lib/middleware"
import { put } from "@vercel/blob"

export async function GET() {
  try {
    // Initialiser les tables si elles n'existent pas
    await initAdminTables().catch((err) => {
      console.error("Error initializing tables:", err)
    })

    const videos = await getAllVideos()
    return NextResponse.json({ videos })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ videos: [] })
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

    await initAdminTables().catch((err) => {
      console.error("Error initializing tables:", err)
    })

    const formData = await request.formData()
    const title = formData.get("title") as string
    const embed_url = formData.get("embed_url") as string
    const videoFile = formData.get("video_file") as File | null
    const category = formData.get("category") as string | null
    const thumbnail = formData.get("thumbnail") as File | null

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if ((!embed_url || embed_url.trim().length === 0) && (!videoFile || videoFile.size === 0)) {
      return NextResponse.json({ error: "Add a video file or a video URL" }, { status: 400 })
    }

    let sourceUrl = embed_url?.trim() || ""
    if (videoFile && videoFile.size > 0) {
      if (!videoFile.type.startsWith("video/")) {
        return NextResponse.json({ error: "Unsupported video format" }, { status: 400 })
      }
      if (videoFile.size > 250 * 1024 * 1024) {
        return NextResponse.json({ error: "Video file too large (250MB max)" }, { status: 400 })
      }
      const blob = await put(videoFile.name, videoFile, { access: "public", addRandomSuffix: true })
      sourceUrl = blob.url
    } else {
      try {
        new URL(sourceUrl)
      } catch {
        return NextResponse.json({ error: "Invalid video URL format" }, { status: 400 })
      }
    }

    let thumbnail_url = null

    if (thumbnail && thumbnail.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(thumbnail.type)) {
        return NextResponse.json({ error: "Invalid image type (JPEG, PNG, WebP only)" }, { status: 400 })
      }

      if (thumbnail.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 })
      }

      const blob = await put(thumbnail.name, thumbnail, { access: "public", addRandomSuffix: true })
      thumbnail_url = blob.url
    }

    // Sanitize inputs
    const sanitizedData = {
      title: title.trim().slice(0, 255),
      embed_url: sourceUrl.slice(0, 1000),
      thumbnail_url: thumbnail_url ? String(thumbnail_url).trim().slice(0, 1000) : null,
      category: category ? String(category).trim().slice(0, 100) : null,
    }

    const [newVideo] = await addVideo(sanitizedData)

    return NextResponse.json({ success: true, video: newVideo })
  } catch (error) {
    console.error("Error adding video:", error)
    return NextResponse.json({ error: "Failed to add video" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification JWT
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await request.json()

    if (!id || typeof id !== 'number' || id <= 0) {
      return NextResponse.json({ error: "Valid video ID is required" }, { status: 400 })
    }

    await deleteVideo(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}
