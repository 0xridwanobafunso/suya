import { ClientOpts } from 'redis'

/**
 * @interface IRedisOptionsBag
 */
export interface IRedisOptionsBag {
  /** redis options. */
  options: ClientOpts
}
