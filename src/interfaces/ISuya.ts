import { IMiddlewareFunction } from './IMiddlewareFunction'
import { IResetOnMutateOptionsBag } from '../interfaces/IResetOnMutateOptionsBag'

/**
 * @interface ISuya
 */
export interface ISuya {
  /** Suya forever. */
  forever(): IMiddlewareFunction
  /** Suya duration. */
  duration(n: number): IMiddlewareFunction
  /** Suya resetOnMutate. */
  resetOnMutate(resetOpts: IResetOnMutateOptionsBag): IMiddlewareFunction
}
