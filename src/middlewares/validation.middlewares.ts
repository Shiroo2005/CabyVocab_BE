import { ValidationChain, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { AuthRequestError, BadRequestError } from '~/core/error.response'
import { AuthorizationError } from 'passport-oauth2'

export const validate = (validate: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validate.map((validation) => validation.run(req)))
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)

        if (errors.array()[0].location == 'headers') {
          return next(new AuthRequestError(errorMessages[0]))
        }

        next(
          new BadRequestError({
            message: errorMessages[0]
          })
        )
        return
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
