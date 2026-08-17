import { NextResponse } from "next/server"
import { getAllGalleryImages, initAdminTables } from "@/lib/admin-db"

// GET is public - read gallery images
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
