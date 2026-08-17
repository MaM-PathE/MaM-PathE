import { type NextRequest, NextResponse } from "next/server"
import { initAuthTable, verifyCredentials, generateTokenPair } from "@/lib/auth"
import { loginSchema, validateInput } from "@/lib/validations"
import { checkRateLimit, getClientIP, loginRateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  try {
    // Récupérer l'IP pour le rate limiting
    const ip = getClientIP(request)

    // Vérifier le rate limit
    const rateLimitResult = checkRateLimit(ip, loginRateLimit)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please try again later.",
          retryAfter: rateLimitResult.resetIn 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.resetIn),
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetIn),
          }
        }
      )
    }

    // Parse et valider les entrées avec Zod
    const body = await request.json()
    const validation = validateInput(loginSchema, body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { username, password } = validation.data

    // Ensure the production database has the admin table and initial admin user.
    const initialization = await initAuthTable()
    if (!initialization.success) {
      console.error("[v0] Admin auth initialization failed", initialization.error)
      return NextResponse.json(
        { error: "Admin authentication is not configured yet" },
        { status: 503 },
      )
    }

    // Vérifier les identifiants
    const user = await verifyCredentials(username.trim(), password)

    if (!user) {
      // Ne pas révéler si c'est le username ou le password qui est incorrect
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Générer les tokens JWT
    const { accessToken, refreshToken } = await generateTokenPair(user)

    // Créer la réponse avec les cookies sécurisés
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    })

    const isProduction = process.env.NODE_ENV === "production"

    // Définir les cookies directement dans la réponse
    response.cookies.set({
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    })

    response.cookies.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}
