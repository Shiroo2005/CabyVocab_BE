import { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '~/core/error.response'
import { isValidNumber } from '~/utils'

export const getChildCommentValidation = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params?.id
  const parentId = req.params?.parentId

  if (id && !isValidNumber(id)) {
    throw new BadRequestError({ message: 'Id invalid!' })
  }

  if (parentId != 'null' && !isValidNumber(parentId)) {
    throw new BadRequestError({ message: 'Parent id invalid!' })
  }

  next()
}
