import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    return null
  }
  return new TextEncoder().encode(secret)
}

// Security headers to apply to all responses
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://player.vimeo.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' https: blob:",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.dailymotion.com",
    "connect-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add HSTS in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }
  
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Routes d'administration protégées
  if (pathname.startsWith("/admin/dashboard")) {
    const accessToken = request.cookies.get("access_token")?.value
    const refreshToken = request.cookies.get("refresh_token")?.value

    // Si pas de token, rediriger vers login
    if (!accessToken) {
      // Tenter de rafraîchir avec le refresh token
      if (refreshToken) {
        const refreshUrl = new URL("/api/auth/refresh", request.url)
        refreshUrl.searchParams.set("redirect", pathname)
        return addSecurityHeaders(NextResponse.redirect(refreshUrl))
      }
      return addSecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)))
    }

    // Vérifier la validité du token
    try {
      const secret = getJwtSecret()
      if (!secret) {
        console.error("JWT_SECRET not configured")
        return addSecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)))
      }

      const { payload } = await jwtVerify(accessToken, secret)
      
      // Vérifier que c'est bien un access token
      if (payload.type !== "access") {
        return addSecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)))
      }

      // Token valide, continuer avec security headers
      return addSecurityHeaders(NextResponse.next())
    } catch {
      // Token invalide ou expiré, tenter refresh
      if (refreshToken) {
        const refreshUrl = new URL("/api/auth/refresh", request.url)
        refreshUrl.searchParams.set("redirect", pathname)
        return addSecurityHeaders(NextResponse.redirect(refreshUrl))
      }
      return addSecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)))
    }
  }

  // Protection des routes API admin (sauf auth)
  if (pathname.startsWith("/api/admin/") || (pathname.startsWith("/api/blog") && request.method !== "GET")) {
    const accessToken = request.cookies.get("access_token")?.value

    if (!accessToken) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      )
    }

    try {
      const secret = getJwtSecret()
      if (!secret) {
        return addSecurityHeaders(
          NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        )
      }

      const { payload } = await jwtVerify(accessToken, secret)
      
      if (payload.type !== "access") {
        return addSecurityHeaders(
          NextResponse.json({ error: "Invalid token type" }, { status: 401 })
        )
      }

      // Ajouter l'ID utilisateur aux headers pour les routes API
      const response = NextResponse.next()
      response.headers.set("x-user-id", String(payload.userId))
      response.headers.set("x-username", String(payload.username))
      return addSecurityHeaders(response)
    } catch {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      )
    }
  }

  // Bloquer les routes d'initialisation (requiert secret d'admin)
  if (pathname === "/api/init-db" || pathname === "/api/init-admin") {
    const adminSecret = request.headers.get("x-admin-secret")
    if (adminSecret !== process.env.ADMIN_INIT_SECRET) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      )
    }
  }

  // Appliquer les security headers à toutes les autres requêtes
  return addSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
