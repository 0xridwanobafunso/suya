import * as MEMCACHED from 'memjs'

import { promisify } from 'util'
import { Request, Response, NextFunction } from 'express'

import { IResetOnMutateOptionsBag } from '../interfaces/IResetOnMutateOptionsBag'

import { SuyaError } from '../classes/SuyaError'
import { EErrors } from '../enums/EErrors'

/**
 * @class Memcached
 */
export class Memcached {
  /**
   * @static @async @method forever
   *
   * @param {MEMCACHED.Client} memcached - Memcached client
   * @param {Request} req - Express Request
   * @param {Response} res - Express Response
   * @param {NextFunction} next - Express NextFunction
   *
   * @returns {Promise<Response|any>}
   */
  static async forever(
    memcached: MEMCACHED.Client,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    // pass error to the next middleware if the request method is NOT 'GET' so that it
    // can be handle with global express error handlers
    if (!['GET'].includes(req.method))
      next(new SuyaError(EErrors.FOREVER_INVALID_REQUEST_METHOD))

    // It seems memJS client have problem with thier Promise-based style
    // memJS callback seem to be working just fine. so I turn their callbacks
    // into Promise with NodeJS promisify
    let get = promisify(memcached.get).bind(memcached)
    let set = promisify(memcached.set).bind(memcached)

    // build key based on request url and check if memcached has it in memory
    let key: string = '__suya__' + req.originalUrl || req.url
    let cached: Buffer | null = await get(key)

    // yay!!! it's in memory
    if (cached) {
      // set the response header, 'content-type' to 'application/json'
      res.setHeader('Content-Type', 'application/json')

      // return res.send and parse the stringify data in memcached memory
      return res.send(JSON.parse(cached.toString()))
    } else {
      // nil!!! it's NOT in memory

      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response | any {
        // stringify and store body in memchached memory forever
        // re-overriding expires here to *never expires*
        set(key, JSON.stringify(body), { expires: 0 })
          .then((done) => {
            // if successfully(true) set, return res.send store in 'send' variable
            // with the body data
            if (done) return send.call(this, body)
          })
          .catch()
      }

      // move to the next middleware in the cycle
      next()
    }
  }

  /**
   * @static @async @method duration
   *
   * @param {MEMCACHED.Client} memcached - Memcached client
   * @param {number} n -  Duration to keep cache in seconds i.e TTL - Time To Live
   * @param {Request} req - Express Request
   * @param {Response} res - Express Response
   * @param {NextFunction} next - Express NextFunction
   *
   * @returns {Promise<Response|any>}
   */
  static async duration(
    memcached: MEMCACHED.Client,
    n: number,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    // pass error to the next middleware if the request method is NOT 'GET' so that it
    // can be handle with global express error handlers
    if (!['GET'].includes(req.method))
      next(new SuyaError(EErrors.DURATION_INVALID_REQUEST_METHOD))

    // It seems memJS client have problem with thier Promise-based style
    // memJS callback seem to be working just fine. so I turn their callbacks
    // into Promise with NodeJS promisify
    let get = promisify(memcached.get).bind(memcached)
    let set = promisify(memcached.set).bind(memcached)

    // build key based on request url and check if memcached has it in memory
    let key: string = '__suya__' + req.originalUrl || req.url
    let cached: Buffer | null = await get(key)

    // yay!!! it's in memory
    if (cached) {
      // set the response header, 'content-type' to 'application/json'
      res.setHeader('Content-Type', 'application/json')

      // return res.send and parse the stringify data in memcached memory
      return res.send(JSON.parse(cached.toString()))
    } else {
      // nil!!! it's NOT in memory

      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response | any {
        // stringify and store body in memcached memory for n seconds
        // re-overriding expires here to n seconds
        set(key, JSON.stringify(body), { expires: n })
          .then((done) => {
            // if successfully(true) set, return res.send store in 'send' variable
            // with the body data
            if (done) return send.call(this, body)
          })
          .catch()
      }

      // move to the next middleware in the cycle
      next()
    }
  }

  /**
   * @static @async @method resetOnMutate
   *
   * @param {MEMCACHED.Client} memcached - Memcached client
   * @param {IResetOnMutateOptionsBag} resetOpts - Options to indicate successful
   * mutation
   * @param {Request} req - Express Request
   * @param {Response} res - Express Response
   * @param {NextFunction} next - Express NextFunction
   *
   * @returns {Promise<Response|any>}
   */
  static async resetOnMutate(
    memcached: MEMCACHED.Client,
    resetOpts: IResetOnMutateOptionsBag,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    // pass error to the next middleware if the request method is NOT 'POST', 'PUT',
    // 'PATCH', or 'DELETE', so that it can be handle with global express error
    // handlers
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method))
      next(new SuyaError(EErrors.RESETONMUTATE_INVALID_REQUEST_METHOD))

    // It seems memJS client have problem with thier Promise-based style
    // memJS callback seem to be working just fine. so I turn their callbacks
    // into Promise with NodeJS promisify
    let get = promisify(memcached.get).bind(memcached)
    let del = promisify(memcached.delete).bind(memcached)

    // type asserting indicator as *any* because typescript only knew indicator
    // has *object* but doesn't know the keys available on the object
    let { indicator } = resetOpts as any

    // store successful mutation indicator key and value into 'indicatorK' and
    // 'indicatorV' respectively
    let indicatorK = Object.keys(indicator)[0]
    let indicatorV = indicator[indicatorK]

    // build key based on request url and check if memcached has it in memory
    let key: string = '__suya__' + req.originalUrl || req.url
    let cached: Buffer | null = await get(key)

    // yay!!! it's in memory
    if (cached) {
      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response | any {
        // parse json body into object and check if it has the indicator key
        // and the key is the same as the my successful indicator value
        if (JSON.parse(body)[indicatorK] == indicatorV) {
          // delete from memcached cache
          del(key)
            .then((deleted) => {
              // if successfully(true) deleted, return res.send store in 'send'
              // variable with the body data
              if (deleted) return send.call(this, body)
            })
            .catch()
        } else {
          // return res.send store in 'send' variable with the body data
          return send.call(this, body)
        }
      }

      // move to the next middleware in the cycle
      next()
    } else {
      // nil!!! it's NOT in memory

      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response {
        // return res.send store in 'send' variable with the body data
        return send.call(this, body)
      }

      // move to the next middleware in the cycle
      next()
    }
  }
}
