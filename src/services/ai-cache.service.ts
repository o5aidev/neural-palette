/**
 * AI Cache Service
 * Caching layer for AI responses to reduce API calls and costs
 */

import { aiConfig } from '../config/ai-config';
import crypto from 'crypto';

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  oldestEntry: number | null;
  newestEntry: number | null;
}

/**
 * In-Memory Cache with LRU eviction
 */
export class AICacheService<T = any> {
  private static instance: AICacheService;
  private cache: Map<string, CacheEntry<T>>;
  private accessOrder: Map<string, number>;
  private config = aiConfig.cache;
  private stats = {
    hits: 0,
    misses: 0,
  };

  private constructor() {
    this.cache = new Map();
    this.accessOrder = new Map();
  }

  public static getInstance<T = any>(): AICacheService<T> {
    if (!AICacheService.instance) {
      AICacheService.instance = new AICacheService();
    }
    return AICacheService.instance as AICacheService<T>;
  }

  /**
   * Generate cache key from request
   */
  generateKey(data: any): string {
    const normalized = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Get cached value
   */
  get(key: string): T | null {
    if (!this.config.enabled) {
      return null;
    }

    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access order and hit count
    this.accessOrder.set(key, now);
    entry.hits++;
    this.stats.hits++;

    return entry.value;
  }

  /**
   * Set cache value
   */
  set(key: string, value: T, ttl?: number): void {
    if (!this.config.enabled) {
      return;
    }

    const now = Date.now();
    const entryTTL = ttl ?? this.config.ttl;

    // Evict if at capacity
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: now,
      ttl: entryTTL,
      hits: 0,
    };

    this.cache.set(key, entry);
    this.accessOrder.set(key, now);
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    this.accessOrder.delete(key);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(e => e.timestamp);

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: this.stats.hits + this.stats.misses > 0
        ? this.stats.hits / (this.stats.hits + this.stats.misses)
        : 0,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null,
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, time] of this.accessOrder.entries()) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }

  /**
   * Get top N most accessed entries
   */
  getTopEntries(n: number = 10): Array<{ key: string; hits: number; age: number }> {
    const now = Date.now();
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        hits: entry.hits,
        age: now - entry.timestamp,
      }))
      .sort((a, b) => b.hits - a.hits)
      .slice(0, n);

    return entries;
  }
}

/**
 * Specialized AI Response Cache
 */
export class AIResponseCache {
  private static instance: AIResponseCache;
  private cache: AICacheService<any>;

  private constructor() {
    this.cache = AICacheService.getInstance();
  }

  public static getInstance(): AIResponseCache {
    if (!AIResponseCache.instance) {
      AIResponseCache.instance = new AIResponseCache();
    }
    return AIResponseCache.instance;
  }

  /**
   * Cache AI completion response
   */
  cacheCompletion(
    request: any,
    response: any,
    ttl?: number
  ): void {
    const key = this.cache.generateKey({
      type: 'completion',
      request,
    });
    this.cache.set(key, response, ttl);
  }

  /**
   * Get cached completion
   */
  getCompletion(request: any): any | null {
    const key = this.cache.generateKey({
      type: 'completion',
      request,
    });
    return this.cache.get(key);
  }

  /**
   * Cache sentiment analysis
   */
  cacheSentiment(
    text: string,
    result: any,
    ttl?: number
  ): void {
    const key = this.cache.generateKey({
      type: 'sentiment',
      text,
    });
    this.cache.set(key, result, ttl);
  }

  /**
   * Get cached sentiment
   */
  getSentiment(text: string): any | null {
    const key = this.cache.generateKey({
      type: 'sentiment',
      text,
    });
    return this.cache.get(key);
  }

  /**
   * Invalidate cache for artist
   */
  invalidateArtist(artistId: string): number {
    let invalidated = 0;
    const entries = Array.from((this.cache as any).cache.entries()) as Array<[string, any]>;

    for (const [key, entry] of entries) {
      const value = entry.value;
      if (value && typeof value === 'object' && value.artistId === artistId) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    return invalidated;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return this.cache.getStats();
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    return this.cache.cleanExpired();
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const aiCache = AIResponseCache.getInstance();

// Schedule periodic cleanup (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = aiCache.cleanExpired();
    if (cleaned > 0) {
      console.log(`[AI Cache] Cleaned ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000);
}
