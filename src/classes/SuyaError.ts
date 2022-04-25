/**
 * @class SuyaError
 *
 * SuyaError extends the base class Error to create it own
 * custom error class
 *
 * e.g
 * ```js
 *    throw new SuyaError('[error.message]')
 * ```
 */
export class SuyaError extends Error {
  /**
   * @constructor new SuyaError
   * @param {string} message - message
   */
  constructor(message: string) {
    super(message)

    // error.name to SuyaError
    this.name = 'SuyaError'
  }
}
