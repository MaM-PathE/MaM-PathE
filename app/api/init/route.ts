import { NextResponse } from "next/server"
import { initializeAuthTable } from "@/lib/auth"
import { initAdminTables } from "@/lib/admin-db"

// Cette route initialise les tables de base de données
// Elle est appelée une seule fois au démarrage
export async function GET() {
  try {
    // Initialiser les tables auth
    const authInit = await initializeAuthTable()
    if (!authInit.success) {
      console.error("Failed to initialize auth table:", authInit.error)
      return NextResponse.json(
        { success: false, auth: authInit.error },
        { status: 500 }
      )
    }

    // Initialiser les tables admin (gallery, videos, podcasts, interventions, supervisions)
    try {
      const adminInit = await initAdminTables()
      if (!adminInit) {
        console.warn("Admin tables initialization returned falsy")
      }
    } catch (adminError) {
      console.error("Failed to initialize admin tables:", adminError)
      // On continue même si l'init admin échoue
    }

    return NextResponse.json({
      success: true,
      message: "Database tables initialized successfully",
    })
  } catch (error) {
    console.error("Init error:", error)
    return NextResponse.json(
      { success: false, error: "Initialization failed" },
      { status: 500 }
    )
  }
}
