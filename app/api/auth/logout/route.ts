import { NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/middleware"

export async function POST() {
  try {
    await clearAuthCookies()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}
