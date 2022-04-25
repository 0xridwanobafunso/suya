import * as NODECACHE from 'node-cache'
import * as REDIS from 'redis'
import * as MEMCACHED from 'memjs'
import 'colors'

// Express Types
import { Request, Response, NextFunction } from 'express'

// Suya Implementing Inteface
import { ISuya } from '../interfaces/ISuya'

// Suya Options Bag
import { ISuyaOptionsBag } from '../interfaces/ISuyaOptionsBag'
import { IResetOnMutateOptionsBag } from '../interfaces/IResetOnMutateOptionsBag'

// Suya Supported Engines
import { ESupportedEngines } from '../enums/ESupportedEngines'

// Express Middlewares
import { Nodecache } from './Nodecache'
import { Redis } from './Redis'
import { Memcached } from './Memcached'

// TryCatch
import { TryCatch } from '../functions/TryCatch'

// Express Middleware Return Type
import { IMiddlewareFunction } from '../interfaces/IMiddlewareFunction'

// Custom Suya Error Class
import { SuyaError } from '../classes/SuyaError'

// Suya Error Messages
import { EErrors } from '../enums/EErrors'
import { ESuccess } from '../enums/ESuccess'
import { EWarnings } from '../enums/EWarnings'

/**
 * @class Suya
 *
 * Suya is a blazing-fast and strongly-typed express middleware(s) that adds
 * caching layer on top of your express API response to improve performance.
 */
export class Suya implements ISuya {
  private opts
  private nodecache
  private redis
  private memcached

  private loggingLine: string =
    '----------------------------------------------------'

  constructor(opts: ISuyaOptionsBag) {
    this.opts = opts

    switch (this.opts.engine.name) {
      case ESupportedEngines.NODECACHE:
        // instantiate node-cache class
        this.nodecache = new NODECACHE.default()

        break
      case ESupportedEngines.REDIS:
        if (this.opts.engine.configs?.redis) {
          // create redis client with connections options
          this.redis = REDIS.createClient(
            this.opts.engine.configs?.redis?.options ?? {}
          )

          // node-redis events is logged implicitly
          // but you can explicitly set it to true|false
          if (this.opts.engine?.logging ?? true) {
            this.redis
              .on('ready', () => {
                // logging to console when redis connection established
                console.log(this.loggingLine.green)
                console.log(ESuccess.REDIS_CONNECTED.green.bold)
                console.log(this.loggingLine.green)
              })
              .on('reconnecting', () => {
                // logging to console when redis reconnecting
                console.log(this.loggingLine.yellow)
                console.log(EWarnings.REDIS_RECONNECTING.yellow.underline)
                console.log(this.loggingLine.yellow)
              })
              .on('end', () => {
                // logging to console when redis connection disconnected
                // successfully
                console.log(this.loggingLine.green)
                console.log(ESuccess.REDIS_DISCONNECTED.green.underline.bold)
                console.log(this.loggingLine.green)
              })
              .on('error', (err) => {
                // logging to console when redis emit errors
                console.log(this.loggingLine.red)
                console.log(
                  EErrors.REDIS_ERRORS.replace(/{err}/gi, err).red.bold
                )
                console.log(this.loggingLine.red)
              })
          }
        } else throw new SuyaError(EErrors.INVALID_CONFIGS_FOR_REDIS)
        break
      case ESupportedEngines.MEMCACHED:
        if (this.opts.engine.configs?.memcached) {
          // create memcached client with server and options
          this.memcached = MEMCACHED.Client.create(
            this.opts.engine.configs.memcached.server,
            {
              ...this.opts.engine.configs.memcached.options,
              // expires is overidden here with *never expires*, 0
              // this same expires will also be overridden when setting keys in
              // different memcached middlewares e.g forever() with 0 second and
              // duration([n]) with n seconds
              expires: 0,
              // custom logger for memcached to follow suya logging style for
              // consistency
              logger: {
                log: (message: string): void => {
                  // logging is enabled by default
                  // but you can explicitly set it to true|false
                  if (this.opts.engine?.logging ?? true) {
                    console.log(this.loggingLine.red)
                    console.log(message.red.bold)
                    console.log(this.loggingLine.red)
                  }
                },
              },
            }
          )

          // memcached stats is logged implicitly
          // but you can explicitly set it to true|false
          if (this.opts.engine?.logging ?? true) {
            // verify if memcached server is up and running
            this.memcached.stats((err, server, stat) => {
              if (err) {
                // logging to console when unable to connect to memcached
                console.log(this.loggingLine.red)
                console.log(EErrors.MEMCACHED_UNABLE_TO_CONNECT.red.bold)
                console.log(this.loggingLine.red)
              } else {
                // logging to console when memcached connected successfully
                console.log(this.loggingLine.green)
                console.log(ESuccess.MEMCACHED_CONNECTED.green.bold)
                console.log(this.loggingLine.green)
              }
            })
          }
        } else throw new SuyaError(EErrors.INVALID_CONFIGS_FOR_MEMCACHED)
        break
      default:
        throw new SuyaError(EErrors.INVALID_ENGINE_NAME)
    }
  }

  /**
   * @method forever
   *
   * This is an express middleware to cache forever.
   * Methods supported: GET
   */
  forever(): IMiddlewareFunction {
    return TryCatch((req: Request, res: Response, next: NextFunction): void => {
      switch (this.opts.engine.name) {
        case ESupportedEngines.NODECACHE:
          Nodecache.forever(this.nodecache as NODECACHE, req, res, next)
          break
        case ESupportedEngines.REDIS:
          Redis.forever(this.redis as REDIS.RedisClient, req, res, next)
          break
        case ESupportedEngines.MEMCACHED:
          Memcached.forever(this.memcached as MEMCACHED.Client, req, res, next)
          break
      }
    })
  }

  /**
   * @method duration
   * @param {string} n - Duration to keep cache in seconds i.e TTL - Time To Live
   *
   * This is an express middleware to cache for a specific seconds.
   * Methods supported: GET
   */
  duration(n: number): IMiddlewareFunction {
    return TryCatch((req: Request, res: Response, next: NextFunction): void => {
      switch (this.opts.engine.name) {
        case ESupportedEngines.NODECACHE:
          Nodecache.duration(this.nodecache as NODECACHE, n, req, res, next)
          break
        case ESupportedEngines.REDIS:
          Redis.duration(this.redis as REDIS.RedisClient, n, req, res, next)
          break
        case ESupportedEngines.MEMCACHED:
          Memcached.duration(
            this.memcached as MEMCACHED.Client,
            n,
            req,
            res,
            next
          )
          break
      }
    })
  }

  /**
   * @method resetOnMutate
   * @param {IResetOnMutateOptionsBag} resetOpts - Options to indicate
   * successful mutation
   *
   * This is an express middleware to reset cache on mutation.
   * Methods supported: POST, PUT, PATCH, DELETE
   */
  resetOnMutate(resetOpts: IResetOnMutateOptionsBag): IMiddlewareFunction {
    return TryCatch((req: Request, res: Response, next: NextFunction): void => {
      switch (this.opts.engine.name) {
        case ESupportedEngines.NODECACHE:
          Nodecache.resetOnMutate(
            this.nodecache as NODECACHE,
            resetOpts,
            req,
            res,
            next
          )
          break
        case ESupportedEngines.REDIS:
          Redis.resetOnMutate(
            this.redis as REDIS.RedisClient,
            resetOpts,
            req,
            res,
            next
          )
          break
        case ESupportedEngines.MEMCACHED:
          Memcached.resetOnMutate(
            this.memcached as MEMCACHED.Client,
            resetOpts,
            req,
            res,
            next
          )
          break
      }
    })
  }

  /**
   * @method close
   *
   * To close connections to any selected cache engine
   */
  async close(): Promise<void> {
    switch (this.opts.engine.name) {
      case ESupportedEngines.NODECACHE:
        // since node-cache doesn't open any external connection
        // there is no connections to close
        break
      case ESupportedEngines.REDIS:
        // close open redis connections
        await this.redis?.quit()
        break
      case ESupportedEngines.MEMCACHED:
        // close open memcached connections
        await this.memcached?.quit()
        break
    }
  }
}
