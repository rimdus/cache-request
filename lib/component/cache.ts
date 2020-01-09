import { ICache, ICacheOptions } from '../interface/cache.interface';
import { Hash } from './hash';
import { THash } from '../type/hash.type';

/**
 * Cache class save any data by unique objects (requests) to internal storage and free when ttl expired
 */
export class Cache {
  /**
   * @internal
   */
  private cache: Map<THash, ICache> = new Map();
  /**
   * @internal
   */
  private options: ICacheOptions;
  /**
   * @internal
   */
  private interval: NodeJS.Timeout;

  constructor(options?: ICacheOptions) {
    this.options = { ttl: 60, ...options || {} };
    this.on();
  }

  /**
   * @internal
   * Checks and invalidate expires caches
   */
  private checkTtlClbck() {
    const now = Date.now();
    this.cache.forEach((cache, hash, map) => {
      if (cache.expire >= now) {
        map.delete(hash);
      }
    });
  }

  /**
   * Add data to the cache storage
   * @param unique Object to identity cached data
   * @param data Any data
   * @param ttl Time to live in seconds, 0 - used global ttl
   */
  public add(unique: object, data: any, ttl: number = 0): THash {
    const uniqueStr = JSON.stringify(unique);
    const hash = Hash.generate(uniqueStr);
    const expire = Date.now() + (ttl || this.options.ttl);
    const cache = this.cache.get(hash);
    if (!cache || (cache && cache.original === uniqueStr)) {
      this.cache.set(hash, { data, expire, original: uniqueStr });
      return hash;
    }
    return null;
  }

  /**
   * Get cached data
   * @param unique Object to identity cached data
   */
  public get(unique: object): any {
    const uniqueStr = JSON.stringify(unique);
    const hash = Hash.generate(uniqueStr);
    const cache = this.cache.get(hash);
    if (cache && cache.original === uniqueStr) {
      return cache.data;
    }
    return null;
  }

  public off() {
    clearInterval(this.interval);
  }

  public on() {
    this.interval = setInterval(() => this.checkTtlClbck(), this.options.ttl * 1000);
  }

  /**
   * Returns count of all live cahces
   */
  public get count() {
    return this.cache.size;
  }
}
