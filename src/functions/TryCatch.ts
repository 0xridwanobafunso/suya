import { Request, Response, NextFunction } from 'express'

/**
 * @function TryCatch
 *
 * @param {function} fn
 *
 * try...catch block to catch errors thrown in try block and pass the error
 * to the next middleware.
 *
 * e.g
 * ```js
 * async (req, res, next) => {
 *    try {
 *        // error throw during asynchronous task here
 *        let cached = await get(key)
 *    } catch (e){
 *        // pass to next middleware in the cycle
 *        next(e)
 *    }
 * }
 * ```
 */
export const TryCatch = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next)
