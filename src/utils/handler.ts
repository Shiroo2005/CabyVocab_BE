import { RequestHandler, Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import status from 'http-status'
import { ErrorResponse, NotFoundRequestError } from '~/core/error.response'

// Transform to async await for controller
export const wrapRequestHandler = <P = any>(handler: RequestHandler<P>) => {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

//Handle Error for all project
export const errorHandler: ErrorRequestHandler = (
  err: ErrorResponse | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ErrorResponse ? err.statusCode : status.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'
  console.log(err.message)
  res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: message
  })
  return
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundRequestError()
}
