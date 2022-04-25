import { Request, Response, NextFunction } from 'express'

export interface IMiddlewareFunction {
  (req: Request, res: Response, next: NextFunction): void
}
