import { NextFunction, Request, Response } from 'express'
import { User } from '~/entities/user.entity'

export const CreateCustomizeTopicMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  req.body.user = user
  next()
}
