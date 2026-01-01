/**
 * Rate Limiting pour protéger les API
 * Utilise une Map en mémoire (dev) ou Upstash Redis (prod)
 */

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store pour le développement
const memoryStore = new Map<string, RateLimitEntry>();

// Configuration par défaut
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 10;

/**
 * Rate limiter simple basé sur sliding window
 */
export async function rateLimit(
  identifier: string,
  options: {
    windowMs?: number;
    maxRequests?: number;
    prefix?: string;
  } = {}
): Promise<RateLimitResult> {
  const {
    windowMs = DEFAULT_WINDOW_MS,
    maxRequests = DEFAULT_MAX_REQUESTS,
    prefix = "rl",
  } = options;

  const key = `${prefix}:${identifier}`;
  const now = Date.now();

  // Vérifier si Upstash est configuré
  if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
    return rateLimitUpstash(key, windowMs, maxRequests);
  }

  // Fallback: rate limiting en mémoire
  return rateLimitMemory(key, now, windowMs, maxRequests);
}

/**
 * Rate limiting en mémoire (développement)
 */
function rateLimitMemory(
  key: string,
  now: number,
  windowMs: number,
  maxRequests: number
): RateLimitResult {
  const entry = memoryStore.get(key);

  // Nouvelle entrée ou fenêtre expirée
  if (!entry || now > entry.resetTime) {
    memoryStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      reset: now + windowMs,
    };
  }

  // Vérifier la limite
  if (entry.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  // Incrémenter le compteur
  entry.count++;
  memoryStore.set(key, entry);

  return {
    success: true,
    remaining: maxRequests - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Rate limiting avec Upstash Redis (production)
 */
async function rateLimitUpstash(
  key: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult> {
  try {
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    });

    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;

    // Incrémenter et obtenir le compteur
    const count = await redis.incr(windowKey);

    // Définir l'expiration si c'est une nouvelle clé
    if (count === 1) {
      await redis.expire(windowKey, Math.ceil(windowMs / 1000));
    }

    const remaining = Math.max(0, maxRequests - count);
    const reset = (Math.floor(now / windowMs) + 1) * windowMs;

    return {
      success: count <= maxRequests,
      remaining,
      reset,
    };
  } catch (error) {
    console.error("Upstash rate limit error:", error);
    // Fallback permissif en cas d'erreur Redis
    return { success: true, remaining: maxRequests, reset: Date.now() + windowMs };
  }
}

/**
 * Rate limiters préconfigurés pour différents cas d'usage
 */
export const rateLimiters = {
  // Analyse de documents: 10 par minute
  analyze: (userId: string) =>
    rateLimit(userId, {
      prefix: "analyze",
      maxRequests: 10,
      windowMs: 60 * 1000,
    }),

  // Analyse d'enseignes: 10 par minute
  signage: (userId: string) =>
    rateLimit(userId, {
      prefix: "signage",
      maxRequests: 10,
      windowMs: 60 * 1000,
    }),

  // API générale: 100 par minute
  api: (identifier: string) =>
    rateLimit(identifier, {
      prefix: "api",
      maxRequests: 100,
      windowMs: 60 * 1000,
    }),

  // Webhooks: 50 par minute (par IP)
  webhook: (ip: string) =>
    rateLimit(ip, {
      prefix: "webhook",
      maxRequests: 50,
      windowMs: 60 * 1000,
    }),

  // Auth attempts: 5 par minute (anti-brute force)
  auth: (identifier: string) =>
    rateLimit(identifier, {
      prefix: "auth",
      maxRequests: 5,
      windowMs: 60 * 1000,
    }),
};

/**
 * Nettoyer les entrées expirées (pour le mode mémoire)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (now > entry.resetTime) {
      memoryStore.delete(key);
    }
  }
}

// Nettoyage automatique toutes les 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}
