/**
 * Cache options
 */
export interface ICacheOptions {
  /**
   * Global cache ttl in seconds
   */
  ttl?: number;
}

/**
 * Cache structure
 */
export interface ICache {
  /**
   * Cached data
   */
  data: any;
  /**
   * Expire date in ms
   */
  expire: number
  /**
   * original unique string
   */
  original: string;
}
