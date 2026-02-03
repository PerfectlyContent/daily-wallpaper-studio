/**
 * Image Caching System
 *
 * Cost optimization through caching:
 * - Cache generated images by prompt hash
 * - If two users want "sunset mountains" in same style, serve the same image
 * - Store images, don't regenerate
 */

import crypto from 'crypto';

// In-memory cache for demo (in production, use Redis or database)
interface CacheEntry {
  imageUrl: string;
  thumbnailBase64?: string;
  createdAt: number;
  hitCount: number;
}

const imageCache = new Map<string, CacheEntry>();

// Cache TTL: 7 days
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Generate a consistent hash for a prompt
 * Same prompt = same hash = cache hit
 */
export function hashPrompt(prompt: string): string {
  // Normalize: lowercase, trim, remove extra spaces
  const normalized = prompt.toLowerCase().trim().replace(/\s+/g, ' ');
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16);
}

/**
 * Check if we have a cached image for this prompt
 */
export function getCachedImage(promptHash: string): CacheEntry | null {
  const entry = imageCache.get(promptHash);

  if (!entry) return null;

  // Check if cache entry is expired
  if (Date.now() - entry.createdAt > CACHE_TTL_MS) {
    imageCache.delete(promptHash);
    return null;
  }

  // Increment hit count
  entry.hitCount++;

  console.log(`Cache HIT for ${promptHash} (${entry.hitCount} hits)`);
  return entry;
}

/**
 * Store a generated image in cache
 */
export function cacheImage(
  promptHash: string,
  imageUrl: string,
  thumbnailBase64?: string
): void {
  imageCache.set(promptHash, {
    imageUrl,
    thumbnailBase64,
    createdAt: Date.now(),
    hitCount: 0,
  });

  console.log(`Cached image for ${promptHash}`);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { entries: number; totalHits: number } {
  let totalHits = 0;
  imageCache.forEach(entry => {
    totalHits += entry.hitCount;
  });

  return {
    entries: imageCache.size,
    totalHits,
  };
}

/**
 * Clear expired cache entries (run periodically)
 */
export function cleanCache(): number {
  const now = Date.now();
  let cleaned = 0;

  imageCache.forEach((entry, key) => {
    if (now - entry.createdAt > CACHE_TTL_MS) {
      imageCache.delete(key);
      cleaned++;
    }
  });

  return cleaned;
}

/**
 * Pre-generated wallpaper library
 * These are wallpapers generated during "off-peak" or batch operations
 * Users can browse these instead of generating new ones
 */
export interface PreGeneratedWallpaper {
  id: string;
  imageUrl: string;
  thumbnailBase64?: string;
  styleUniverse: string;
  palette: string;
  pattern: string;
  timeOfDay: string;
  vibe: string;
  promptHash: string;
  tags: string[];
}

// Pre-generated library (in production, this would be in a database)
const preGeneratedLibrary: PreGeneratedWallpaper[] = [];

/**
 * Add a wallpaper to the pre-generated library
 */
export function addToLibrary(wallpaper: PreGeneratedWallpaper): void {
  preGeneratedLibrary.push(wallpaper);
}

/**
 * Browse pre-generated wallpapers by style
 */
export function browseLibrary(filters?: {
  styleUniverse?: string;
  vibe?: string;
  timeOfDay?: string;
}): PreGeneratedWallpaper[] {
  return preGeneratedLibrary.filter(wp => {
    if (filters?.styleUniverse && wp.styleUniverse !== filters.styleUniverse) return false;
    if (filters?.vibe && wp.vibe !== filters.vibe) return false;
    if (filters?.timeOfDay && wp.timeOfDay !== filters.timeOfDay) return false;
    return true;
  });
}

/**
 * Get a random wallpaper from the library matching criteria
 */
export function getRandomFromLibrary(filters?: {
  styleUniverse?: string;
  vibe?: string;
}): PreGeneratedWallpaper | null {
  const matching = browseLibrary(filters);
  if (matching.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * matching.length);
  return matching[randomIndex];
}

/**
 * Get library statistics
 */
export function getLibraryStats(): { total: number; byStyle: Record<string, number> } {
  const byStyle: Record<string, number> = {};

  preGeneratedLibrary.forEach(wp => {
    byStyle[wp.styleUniverse] = (byStyle[wp.styleUniverse] || 0) + 1;
  });

  return {
    total: preGeneratedLibrary.length,
    byStyle,
  };
}
