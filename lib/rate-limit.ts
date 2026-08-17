/**
 * Simple in-memory rate limiter for serverless environments
 * Note: In production with multiple instances, use Redis (Upstash) for distributed rate limiting
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (resets on cold starts, which is acceptable for basic protection)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60000 // 1 minute
let lastCleanup = Date.now()

function cleanupExpiredEntries() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  
  lastCleanup = now
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
  /** Identifier prefix (e.g., 'login', 'contact') */
  prefix: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetIn: number // seconds until reset
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpiredEntries()
  
  const key = `${config.prefix}:${identifier}`
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  
  const entry = rateLimitStore.get(key)
  
  // No existing entry or entry has expired
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetIn: config.windowSeconds,
    }
  }
  
  // Entry exists and is still valid
  const remaining = config.limit - entry.count
  const resetIn = Math.ceil((entry.resetTime - now) / 1000)
  
  if (entry.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetIn,
    }
  }
  
  // Increment count
  entry.count++
  
  return {
    success: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - entry.count),
    resetIn,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Take the first IP if there are multiple
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP.trim()
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP.trim()
  }
  
  // Fallback
  return 'unknown'
}

// =====================================
// Pre-configured Rate Limiters
// =====================================

/** Login: 5 attempts per 15 minutes */
export const loginRateLimit: RateLimitConfig = {
  limit: 5,
  windowSeconds: 900, // 15 minutes
  prefix: 'login',
}

/** Contact form: 3 submissions per hour */
export const contactRateLimit: RateLimitConfig = {
  limit: 3,
  windowSeconds: 3600, // 1 hour
  prefix: 'contact',
}

/** API general: 100 requests per minute */
export const apiRateLimit: RateLimitConfig = {
  limit: 100,
  windowSeconds: 60,
  prefix: 'api',
}

/** Admin actions: 30 actions per minute */
export const adminRateLimit: RateLimitConfig = {
  limit: 30,
  windowSeconds: 60,
  prefix: 'admin',
}

/** Init routes: 1 request per hour (very strict) */
export const initRateLimit: RateLimitConfig = {
  limit: 1,
  windowSeconds: 3600,
  prefix: 'init',
}
