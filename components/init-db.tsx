import { initAuthTable } from "@/lib/auth"
import { initAdminTables } from "@/lib/admin-db"

// Server component that initializes database tables on startup
export async function InitDB() {
  try {
    // Initialize auth tables
    await initAuthTable()
    console.log("[InitDB] Auth tables initialized successfully")

    // Initialize admin tables
    try {
      await initAdminTables()
      console.log("[InitDB] Admin tables initialized successfully")
    } catch (error) {
      console.error("[InitDB] Failed to initialize admin tables:", error)
    }
  } catch (error) {
    console.error("[InitDB] Initialization error:", error)
  }

  return null
}
