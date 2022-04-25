import { TSuyaSupportedEngines } from '../aliases/TSupportedEngines'
import { IRedisOptionsBag } from './IRedisOptionsBag'
import { IMemcachedOptionsBag } from './IMemcachedOptionsBag'

/**
 * @interface ISuyaOptionsBag
 */
export interface ISuyaOptionsBag {
  /** Suya engine */
  engine: {
    /** Suya supported engine name i.e 'node-cache' | 'redis' | 'memcached'. */
    name: TSuyaSupportedEngines
    /** Suya engine configurations based on engine selected. */
    configs?: {
      /** Suya engine configurations for redis. */
      redis?: IRedisOptionsBag
      /** Suya engine configurations for memcached. */
      memcached?: IMemcachedOptionsBag
    }
    /** Whether suya should or shouldn't log to console. Default to true */
    logging?: boolean
  }
}
