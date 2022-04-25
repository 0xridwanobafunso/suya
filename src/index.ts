/**
 * @package Suya - Suya is a blazing-fast and strongly-typed express middleware(s)
 * that adds caching layer on top of your express API response to improve performance.
 * @author Obafunso Ridwan Adebayo 
 * @license
 * MIT License.
 *
 * Copyright (c) 2020 Obafunso Ridwan Adebayo
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { Suya } from './classes/Suya'

/**
 * --------------------------------
 * Exporting Suya as default export
 * --------------------------------
 *
 * e.g for NodeJS Project
 * ```js
 * const Suya = require('suya').default
 * ```
 *
 * e.g for NodeTS Project
 * ```ts
 * import Suya from 'suya'
 * ```
 */
export default Suya

/**
 * ---------------------------------
 * Exporting Suya as a named export
 * ---------------------------------
 *
 * e.g for NodeJS Project
 * ```js
 * const { Suya } = require('suya')
 * ```
 *
 * e.g for NodeTS Project
 * ```ts
 * import { Suya } from 'suya'
 * ```
 */
export { Suya }
