import { cookies } from "next/headers"
import { verifyToken, type TokenPayload } from "./auth"

export interface AuthResult {
  authenticated: boolean
  user?: { id: number; username: string }
  error?: string
}

/**
 * Vérifie l'authentification côté serveur
 * Utilise le access token stocké dans les cookies
 */
export async function checkAuth(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("access_token")?.value

    if (!accessToken) {
      return { authenticated: false, error: "No access token" }
    }

    const payload = await verifyToken(accessToken)

    if (!payload) {
      return { authenticated: false, error: "Invalid token" }
    }

    if (payload.type !== "access") {
      return { authenticated: false, error: "Invalid token type" }
    }

    return {
      authenticated: true,
      user: { id: payload.userId, username: payload.username },
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return { authenticated: false, error: "Authentication check failed" }
  }
}

/**
 * Vérifie l'authentification dans les routes API
 * Extrait les tokens depuis les cookies du request
 */
export async function verifyAuth(request?: Request): Promise<AuthResult> {
  try {
    if (!request) {
      // Fallback to checkAuth (for server components)
      return checkAuth()
    }

    // Extraire le token du cookie "access_token"
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) {
      return { authenticated: false, error: "No access token" }
    }

    // Parser le cookie pour trouver "access_token"
    const accessToken = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("access_token="))
      ?.split("=")[1]

    if (!accessToken) {
      return { authenticated: false, error: "No access token" }
    }

    const payload = await verifyToken(accessToken)

    if (!payload) {
      return { authenticated: false, error: "Invalid token" }
    }

    if (payload.type !== "access") {
      return { authenticated: false, error: "Invalid token type" }
    }

    return {
      authenticated: true,
      user: { id: payload.userId, username: payload.username },
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return { authenticated: false, error: "Authentication check failed" }
  }
}

/**
 * Middleware helper pour protéger les routes API
 * Retourne null si authentifié, sinon retourne une Response d'erreur
 */
export async function requireAuth(): Promise<{ user: { id: number; username: string } } | null> {
  const authResult = await checkAuth()
  
  if (!authResult.authenticated || !authResult.user) {
    return null
  }

  return { user: authResult.user }
}

/**
 * Définit les cookies d'authentification sécurisés
 */
export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === "production"

  // Access token - courte durée, HttpOnly
  cookieStore.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  })

  // Refresh token - longue durée, HttpOnly
  cookieStore.set({
    name: "refresh_token",
    value: refreshToken,
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  })
}

/**
 * Supprime les cookies d'authentification
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies()
  
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")
  // Supprimer aussi les anciens cookies pour la migration
  cookieStore.delete("auth_token")
  cookieStore.delete("admin_token")
}

/**
 * Récupère le refresh token
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("refresh_token")?.value || null
}
