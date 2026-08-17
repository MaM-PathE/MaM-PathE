import { type NextRequest, NextResponse } from "next/server"
import { getAllGalleryImages, addGalleryImage, deleteGalleryImage, initAdminTables } from "@/lib/admin-db"
import { put } from "@vercel/blob"
import { verifyAuth } from "@/lib/middleware"

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function GET() {
  try {
    await initAdminTables().catch((err) => {
      console.error("Error initializing tables:", err)
    })

    const images = await getAllGalleryImages()
    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json({ images: [] })
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
    const image = formData.get("image") as File
    const type = (formData.get("type") as string) || "image"
    const category = formData.get("category") as string

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(image.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      )
    }

    // Validate file size
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size: 10MB" },
        { status: 400 }
      )
    }

    // Upload image securely
    const blob = await put(image.name, image, {
      access: "public",
      addRandomSuffix: true,
    })

    // Sanitize inputs
    const sanitizedData = {
      title: title.trim().slice(0, 255),
      image_url: blob.url,
      type: type.trim().slice(0, 50),
      category: category ? category.trim().slice(0, 100) : null,
    }

    const [newImage] = await addGalleryImage(sanitizedData)

    return NextResponse.json({ success: true, image: newImage })
  } catch (error) {
    console.error("Error adding gallery image:", error)
    return NextResponse.json({ error: "Failed to add gallery image" }, { status: 500 })
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
      return NextResponse.json({ error: "Valid image ID is required" }, { status: 400 })
    }

    await deleteGalleryImage(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting gallery image:", error)
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 })
  }
}
