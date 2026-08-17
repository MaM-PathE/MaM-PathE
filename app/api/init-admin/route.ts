import { NextResponse } from "next/server"
import { initAdminTables } from "@/lib/admin-db"

// Cette route est protégée par le middleware avec ADMIN_INIT_SECRET
export async function POST(request: Request) {
  try {
    // Double vérification du secret (le middleware vérifie aussi)
    const adminSecret = request.headers.get("x-admin-secret")
    if (adminSecret !== process.env.ADMIN_INIT_SECRET) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await initAdminTables()
    return NextResponse.json({ 
      success: true, 
      message: "Admin tables initialized successfully" 
    })
  } catch (error) {
    console.error("Error initializing admin tables:", error)
    return NextResponse.json(
      { error: "Failed to initialize admin tables" },
      { status: 500 }
    )
  }
}

// Désactiver GET pour éviter les initialisations accidentelles
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST with x-admin-secret header." },
    { status: 405 }
  )
}
