import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export const registerController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { email, password } = req.body

  // const result = await authService.createUser(email, password)

  res.json({
    message: 'Register successful!'
  })
}
