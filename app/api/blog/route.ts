import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { put } from "@vercel/blob"
import { checkAuth } from "@/lib/middleware"

// GET est public - lecture des posts
export async function GET() {
  try {
    const posts = await sql`
      SELECT id, title, content, image_url, created_at 
      FROM blog_posts 
      ORDER BY created_at DESC
    `

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}

// POST est protégé - création de posts (authentification requise)
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await checkAuth()
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const image = formData.get("image") as File | null
    const imageUrlInput = ((formData.get("image_url") as string) || "").trim()

    // Validation des entrées
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    if (title.length > 500) {
      return NextResponse.json(
        { error: "Title is too long (max 500 characters)" },
        { status: 400 }
      )
    }

    if (content.length > 50000) {
      return NextResponse.json(
        { error: "Content is too long (max 50000 characters)" },
        { status: 400 }
      )
    }

    let imageUrl = imageUrlInput || null

    if (image && image.size > 0) {
      // Vérifier le type de fichier
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif", "application/octet-stream"]
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Invalid image type. Allowed: JPEG, PNG, WebP, GIF" },
          { status: 400 }
        )
      }

      // Vérifier la taille (max 5MB)
      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image too large (max 5MB)" },
          { status: 400 }
        )
      }

      const blob = await put(image.name, image, {
        access: "public",
        addRandomSuffix: true,
      })

      imageUrl = blob.url
    }

    // Sanitiser le titre et le contenu (basique)
    const sanitizedTitle = title.trim()
    const sanitizedContent = content.trim()

    const [post] = await sql`
      INSERT INTO blog_posts (title, content, image_url)
      VALUES (${sanitizedTitle}, ${sanitizedContent}, ${imageUrl})
      RETURNING id, title, content, image_url, created_at
    `

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}
