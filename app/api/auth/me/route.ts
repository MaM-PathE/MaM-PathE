import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)

    if (!authResult.authenticated) {
      return NextResponse.json(
        { authenticated: false },
        { status: 200 } // 200 OK pour que le client traite la réponse
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: authResult.user,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { authenticated: false },
      { status: 200 } // 200 OK pour que le client traite la réponse
    )
  }
}
