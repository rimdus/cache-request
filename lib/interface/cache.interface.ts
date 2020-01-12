export enum AddStrategy {
  UpdateExists,
  UpdateNotExists,
}

/**
 * Cache options
 */
export interface ICacheOptions {
  /**
   * Global cache ttl in seconds
   */
  ttl?: number;
  /**
   * Add cache global strategy
   */
  strategy?: AddStrategy;
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
  expire: number;
  /**
   * original unique string
   */
  original: string;
}
