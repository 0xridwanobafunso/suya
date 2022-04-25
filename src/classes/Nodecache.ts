import * as NODECACHE from 'node-cache'
import { Request, Response, NextFunction } from 'express'

import { IResetOnMutateOptionsBag } from '../interfaces/IResetOnMutateOptionsBag'

import { SuyaError } from '../classes/SuyaError'
import { EErrors } from '../enums/EErrors'

/**
 * @class Nodecache
 */
export class Nodecache {
  /**
   * @static @async @method forever
   *
   * @param {NODECACHE} nodecache - nodecache
   * @param {Request} req - Express Request
   * @param {Response} res - Express Response
   * @param {NextFunction} next - Express NextFunction
   *
   * @returns {Promise<Response|any>}
   */
  static async forever(
    nodecache: NODECACHE,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    // pass error to the next middleware if the request method is NOT 'GET' so that it
    // can be handle with global express error handlers
    if (!['GET'].includes(req.method))
      next(new SuyaError(EErrors.FOREVER_INVALID_REQUEST_METHOD))

    // destructure get and set from nodecache object
    let { get, set } = nodecache

    // build key based on request url and check if node has it in memory
    let key: string = '__suya__' + req.originalUrl || req.url
    let cached: string | undefined = await get(key)

    // yay!!! it's in memory
    if (cached) {
      // set the response header, 'content-type' to 'application/json'
      res.setHeader('Content-Type', 'application/json')

      // return res.send and parse the stringify data in node memory
      return res.send(JSON.parse(cached))
    } else {
      // nil!!! it's NOT in memory

      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response {
        // stringify and store body in node memory forever
        set(key, JSON.stringify(body), 0)

        // return res.send store in 'send' variable with the body data
        return send.call(this, body)
      }

      // move to the next middleware in the cycle
      next()
    }
  }

  /**
   * @static @async @method duration
   *
   * @param {NODECACHE} nodecache - nodecache
   * @param {number} n -  Duration to keep cache in seconds i.e TTL - Time To Live
   * @param {Request} req - Express Request
   * @param {Response} res - Express Response
   * @param {NextFunction} next - Express NextFunction
   *
   * @returns {Promise<Response|any>}
   */
  static async duration(
    nodecache: NODECACHE,
    n: number,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> {
    // pass error to the next middleware if the request method is NOT 'GET' so that it
    // can be handle with global express error handlers
    if (!['GET'].includes(req.method))
      next(new SuyaError(EErrors.DURATION_INVALID_REQUEST_METHOD))

    // destructure get and set from nodecache object
    let { get, set } = nodecache

    // build key based on request url and check if node has it in memory
    let key: string = '__suya__' + req.originalUrl || req.url
    let cached: string | undefined = await get(key)

    // yay!!! it's in memory
    if (cached) {
      // set the response header, 'content-type' to 'application/json'
      res.setHeader('Content-Type', 'application/json')

      // return res.send and parse the stringify data in node memory
      return res.send(JSON.parse(cached))
    } else {
      // nil!!! it's NOT in memory

      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response {
        // stringify and store body in node memory for n seconds
        set(key, JSON.stringify(body), n)

        // return res.send store in 'send' variable with the body data
        return send.call(this, body)
      }

      // move to the next middleware in the cycle
      next()
    }
  }

  /**
   * @static @async @method resetOnMutate
   *
   * @param {NODECACHE} nodecache - nodecache
   * @param {IResetOnMutateOptionsBag} resetOpts - Options to indicate successful
   * mutation
   * @param {Request} req - Express Request
   * @param {Response} res - Express Response
   * @param {NextFunction} next - Express NextFunction
   *
   * @returns {Promise<Response|any>}
   */
  static async resetOnMutate(
    nodecache: NODECACHE,
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

    // destructure get from nodecache object
    let { get } = nodecache

    // type asserting indicator as *any* because typescript only knew indicator
    // has *object* but doesn't know the keys available on the object
    let { indicator } = resetOpts as any

    // store successful mutation indicator key and value into 'indicatorK' and
    // 'indicatorV' respectively
    let indicatorK = Object.keys(indicator)[0]
    let indicatorV = indicator[indicatorK]

    // build key based on request url and check if node has it in memory
    let key: string = '__suya__' + req.originalUrl || req.url
    let cached: string | undefined = await get(key)

    // yay!!! it's in memory
    if (cached) {
      // store res.send() in 'send' variable
      let send = res.send

      // typing body with *any* because there is not JSON type anotation
      res.send = function (body: any): Response | any {
        // parse json body into object and check if it has the indicator key
        // and the key is the same as the my successful indicator value
        if (JSON.parse(body)[indicatorK] == indicatorV) {
          // delete from node-cache cache
          if (nodecache.del(key)) {
            // return res.send store in 'send' variable with the body data
            return send.call(this, body)
          }
        } else {
          // not the same, that means error occured during the mutation

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
