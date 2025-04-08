import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED } from '~/core/success.response'
import { userService } from '~/services/user.service'

export const registerController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { email, password } = req.body

  // const result = await authService.createUser(email, password)

  res.json({
    message: 'Register successful!'
  })
}

class UserController {
  //viet du...
  createUser = async (req: Request<ParamsDictionary, any, any>, res: Response) =>{
    return new CREATED({
      message: 'Create new user successful!',
      metaData: await userService.createUser(req.body)
    }).send(res);
  }

  getUserByEmail = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    return new CREATED({
      message: 'Get user successful',
      metaData: await userService.getUserByEmail(req.body)
    }).send(res);
  }
}

export const userController = new UserController;
