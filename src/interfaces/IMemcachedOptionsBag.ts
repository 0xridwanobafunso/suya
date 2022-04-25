import { ClientOptions } from 'memjs'

/**
 * @interface IMemcachedOptionsBag
 */
export interface IMemcachedOptionsBag {
  /** Memcached server
   *  e.g user:pass@server1:11211,user:pass@server2:11211,...
   */
  server: string
  /** Memcached options */
  options?: ClientOptions
}
