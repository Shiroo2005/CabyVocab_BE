import { ValidationChain, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'

export const validate = (validate: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all(validate.map((validation) => validation.run(req)))
      const errors = validationResult(req)
      console.log(errors)

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg)
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
