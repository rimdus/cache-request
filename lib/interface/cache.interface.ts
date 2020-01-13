/**
 * Add cache strategy
 */
export enum AddStrategy {
  /**
   * Always update cache and set new expires time
   */
  UpdateExists,
  /**
   * Only add not existing cache, that mean time will expare and you mast get new data from the server,
   * then put it to the cache
   */
  AddNotExists,
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
  /**
   * Custom convert function that makes keys
   */
  keyConvert?: (unique: any) => string;
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
