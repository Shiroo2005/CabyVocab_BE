import { RequestHandler, Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import status from 'http-status'
import { ValidationError } from 'sequelize'
import { ErrorResponse, NotFoundRequestError } from '~/core/error.response'
import { convertValidateErr } from './validate'

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
  // if validate error
  if (err instanceof ValidationError) {
    const errorFields = convertValidateErr(err)
    res.status(status.BAD_REQUEST).json({
      message: 'Validate Error',
      statusCode: status.BAD_REQUEST,
      err: errorFields
    })
    return
  }

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
