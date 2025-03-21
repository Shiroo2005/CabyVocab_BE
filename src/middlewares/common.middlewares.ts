import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { BadRequestError } from '~/core/error.response'
import { isValidNumber } from '~/utils'

export const checkIdParamMiddleware = (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
  if (req.params?.id && !isValidNumber(req.params?.id)) {
    throw new BadRequestError({ message: 'Id invalid!' })
  } else next()
}
