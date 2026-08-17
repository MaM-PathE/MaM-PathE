import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

// Configuration JWT sécurisée
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("CRITICAL: JWT_SECRET must be set and at least 32 characters long")
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET environment variable must be set and at least 32 characters")
  }
  return new TextEncoder().encode(secret)
}

// Configuration des tokens
const ACCESS_TOKEN_EXPIRY = "15m" // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d" // 7 jours
const BCRYPT_ROUNDS = 12

// Types
export interface TokenPayload {
  userId: number
  username: string
  type: "access" | "refresh"
}

export interface AuthUser {
  id: number
  username: string
}

// Hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Générer un token JWT
export async function generateToken(
  payload: Omit<TokenPayload, "type">,
  type: "access" | "refresh"
): Promise<string> {
  const secret = getJwtSecret()
  const expiry = type === "access" ? ACCESS_TOKEN_EXPIRY : REFRESH_TOKEN_EXPIRY

  return new SignJWT({ ...payload, type })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(secret)
}

// Vérifier et décoder un token JWT
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as TokenPayload
  } catch (error) {
    console.error("JWT verification failed:", error instanceof Error ? error.message : "Unknown error")
    return null
  }
}

// Générer les deux tokens (access + refresh)
export async function generateTokenPair(user: AuthUser): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { userId: user.id, username: user.username }
  
  const [accessToken, refreshToken] = await Promise.all([
    generateToken(payload, "access"),
    generateToken(payload, "refresh"),
  ])

  return { accessToken, refreshToken }
}

// Initialiser la table des utilisateurs avec mot de passe hashé
export async function initAuthTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE,
        failed_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP WITH TIME ZONE
      )
    `

    // Vérifier si un utilisateur admin existe déjà
    const users = await sql`SELECT id FROM admin_users WHERE username = 'admin' LIMIT 1`

    // Only require the bootstrap password when creating the first admin.
    // Existing admins must remain able to log in if the bootstrap variable is rotated or unavailable.
    if (users.length === 0) {
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD
      if (!initialPassword || initialPassword.length < 12) {
        console.error("CRITICAL: ADMIN_INITIAL_PASSWORD must be set and at least 12 characters")
        return { success: false, error: "ADMIN_INITIAL_PASSWORD not configured properly" }
      }

      const hashedPassword = await hashPassword(initialPassword)
      await sql`
        INSERT INTO admin_users (username, password)
        VALUES ('admin', ${hashedPassword})
      `
      console.log("Admin user created with secure password")
    } else {
      // Synchronize the configured bootstrap credential and clear lockouts.
      const configuredPassword = process.env.ADMIN_INITIAL_PASSWORD
      if (configuredPassword && configuredPassword.length >= 12) {
        const configuredHash = await hashPassword(configuredPassword)
        await sql`
          UPDATE admin_users
          SET password = ${configuredHash}, failed_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
          WHERE username = 'admin'
        `
      } else {
        await sql`
          UPDATE admin_users
          SET failed_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
          WHERE username = 'admin'
        `
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing auth table:", error)
    return { success: false, error }
  }
}

// Vérifier les identifiants de connexion avec protection brute-force
export async function verifyCredentials(username: string, password: string): Promise<AuthUser | null> {
  try {
    // Validation des entrées
    if (!username || !password || username.length > 100 || password.length > 200) {
      return null
    }

    const users = await sql`
      SELECT id, username, password, failed_attempts, locked_until 
      FROM admin_users 
      WHERE username = ${username}
      LIMIT 1
    `

    if (users.length === 0) {
      // Timing attack protection: toujours hasher même si l'utilisateur n'existe pas
      await bcrypt.hash(password, BCRYPT_ROUNDS)
      return null
    }

    const user = users[0]

    // Vérifier si le compte est verrouillé
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      console.warn(`Account ${username} is locked until ${user.locked_until}`)
      return null
    }

    // Vérifier le mot de passe.
    // Migration transparente : si le mot de passe stocké n'est pas un hash bcrypt
    // (ancien système en clair), on compare en clair puis on le re-hash immédiatement.
    let isValid = false
    const storedPassword: string = user.password || ""
    const isBcryptHash = /^\$2[aby]\$/.test(storedPassword)

    if (isBcryptHash) {
      isValid = await verifyPassword(password, storedPassword)
    } else {
      // Legacy plaintext password — comparaison directe puis upgrade
      isValid = storedPassword.length > 0 && storedPassword === password
      if (isValid) {
        const upgradedHash = await hashPassword(password)
        await sql`UPDATE admin_users SET password = ${upgradedHash}, updated_at = CURRENT_TIMESTAMP WHERE id = ${user.id}`
        console.log(`Password for ${username} upgraded to bcrypt hash`)
      }
    }

    if (!isValid) {
      // Incrémenter le compteur d'échecs
      const newFailedAttempts = (user.failed_attempts || 0) + 1
      const lockAccount = newFailedAttempts >= 5

      await sql`
        UPDATE admin_users 
        SET 
          failed_attempts = ${newFailedAttempts},
          locked_until = ${lockAccount ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null}
        WHERE id = ${user.id}
      `

      if (lockAccount) {
        console.warn(`Account ${username} has been locked due to too many failed attempts`)
      }

      return null
    }

    // Réinitialiser les compteurs en cas de succès et mettre à jour last_login
    await sql`
      UPDATE admin_users 
      SET 
        failed_attempts = 0, 
        locked_until = NULL,
        last_login = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${user.id}
    `

    return { id: user.id, username: user.username }
  } catch (error) {
    console.error("Error verifying credentials:", error)
    return null
  }
}

// Changer le mot de passe avec validation
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Validation du nouveau mot de passe
    if (!newPassword || newPassword.length < 12) {
      return { success: false, message: "New password must be at least 12 characters long" }
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return { 
        success: false, 
        message: "Password must contain uppercase, lowercase, and numbers" 
      }
    }

    const users = await sql`SELECT password FROM admin_users WHERE id = ${userId} LIMIT 1`

    if (users.length === 0) {
      return { success: false, message: "User not found" }
    }

    const user = users[0]

    // Vérifier le mot de passe actuel
    const isValid = await verifyPassword(currentPassword, user.password)
    if (!isValid) {
      return { success: false, message: "Current password is incorrect" }
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword)
    await sql`
      UPDATE admin_users 
      SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${userId}
    `

    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, message: "An error occurred while changing password" }
  }
}

// Vérifier un JWT (fonction de compatibilité)
export async function verifyJWT(token: string): Promise<TokenPayload | null> {
  return verifyToken(token)
}

// Rafraîchir les tokens
export async function refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const payload = await verifyToken(refreshToken)
    
    if (!payload || payload.type !== "refresh") {
      return null
    }

    // Vérifier que l'utilisateur existe toujours
    const users = await sql`SELECT id, username FROM admin_users WHERE id = ${payload.userId} LIMIT 1`
    
    if (users.length === 0) {
      return null
    }

    const user = users[0]
    return generateTokenPair({ id: user.id, username: user.username })
  } catch (error) {
    console.error("Error refreshing tokens:", error)
    return null
  }
}
