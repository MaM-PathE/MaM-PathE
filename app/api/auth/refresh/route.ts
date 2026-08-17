import { NextResponse } from "next/server"
import { refreshTokens } from "@/lib/auth"
import { getRefreshToken, setAuthCookies, clearAuthCookies } from "@/lib/middleware"

export async function GET(request: Request) {
  try {
    const refreshToken = await getRefreshToken()
    const url = new URL(request.url)
    const redirectPath = url.searchParams.get("redirect") || "/admin/dashboard"

    if (!refreshToken) {
      await clearAuthCookies()
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    const tokens = await refreshTokens(refreshToken)

    if (!tokens) {
      await clearAuthCookies()
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    // Définir les nouveaux cookies
    await setAuthCookies(tokens.accessToken, tokens.refreshToken)

    // Rediriger vers la page demandée
    return NextResponse.redirect(new URL(redirectPath, request.url))
  } catch (error) {
    console.error("Token refresh error:", error)
    await clearAuthCookies()
    return NextResponse.redirect(new URL("/admin", request.url))
  }
}

export async function POST() {
  try {
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      )
    }

    const tokens = await refreshTokens(refreshToken)

    if (!tokens) {
      await clearAuthCookies()
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      )
    }

    // Définir les nouveaux cookies
    await setAuthCookies(tokens.accessToken, tokens.refreshToken)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 }
    )
  }
}
