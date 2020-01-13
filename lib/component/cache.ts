import { AddStrategy, ICache, ICacheOptions } from '../interface/cache.interface';
import { Hash } from './hash';
import { THash } from '../type/hash.type';
import { clone } from '../clone/clone';

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

  /** @ignore */
  constructor(options?: ICacheOptions) {
    this.options = {
      ttl: 60,
      strategy: AddStrategy.AddNotExists,
      isClone: true,
      ...options || {},
    };
    this.on();
  }

  /**
   * @internal
   * Checks and invalidate expires caches
   */
  private checkTtlClbck() {
    const now = Date.now();
    this.cache.forEach((cache, hash, map) => {
      if (cache.expire < now) {
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
  public add(unique: string, data: any, ttl?: number): THash;
  public add(unique: object, data: any, ttl?: number): THash;
  public add(): THash {
    const uniqueStr = this.convUniqueToStr(arguments[0]);
    const hash = Hash.generate(uniqueStr);
    const cache = this.cache.get(hash);
    const data: any = arguments[1];
    const ttl: number = arguments[2] || 0;
    if (!cache || (cache && this.options.strategy === AddStrategy.UpdateExists && cache.original === uniqueStr)) {
      const expire: number = Date.now() + (ttl || this.options.ttl) * 1000;
      let data2 = data;
      if (this.options.isClone) {
        data2 = clone(data);
      }
      this.cache.set(hash, { expire, data: data2, original: uniqueStr });
      return hash;
    }
    return null;
  }

  /**
   * Get cached data
   * @param unique Object to identity cached data
   */
  public get(unique: string): any;
  public get(unique: object): any;
  public get(): any {
    const uniqueStr = this.convUniqueToStr(arguments[0]);
    const hash = Hash.generate(uniqueStr);
    const cache = this.cache.get(hash);
    if (cache && cache.original === uniqueStr) {
      return cache.data;
    }
    return null;
  }

  /**
   * Get ttl in ms for key
   * @param unique Object to identity cached data
   */
  public getTtl(unique: string): number;
  public getTtl(unique: object): number;
  public getTtl(): number {
    const uniqueStr = this.convUniqueToStr(arguments[0]);
    const hash = Hash.generate(uniqueStr);
    const cache = this.cache.get(hash);
    if (cache) {
      return cache.expire - Date.now();
    }
    return null;
  }

  /**
   * Converts unique to the string key
   * @param unique Object to identity cached data
   */
  private convUniqueToStr(unique: any): string {
    let uniqueStr: string;
    if (typeof this.options.keyConvertFn === 'function') {
      uniqueStr = this.options.keyConvertFn(unique);
    } else if (typeof unique === 'string') {
      uniqueStr = unique;
    } else if (typeof unique === 'object') {
      uniqueStr = JSON.stringify(unique);
    } else {
      uniqueStr = null;
    }
    return uniqueStr;
  }

  /**
   * Stop check cache's live every second
   */
  public off() {
    clearInterval(this.interval);
  }

  /**
   * Begin check cache's live every second
   */
  public on() {
    this.interval = setInterval(() => this.checkTtlClbck(), this.options.ttl * 1000);
  }

  /**
   * Returns count of all live cahces
   */
  public count(): number {
    return this.cache.size;
  }
}
