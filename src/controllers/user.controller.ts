import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { values } from 'lodash'
import { userInfo } from 'os'
import { CREATED } from '~/core/success.response'
import { CreateUserBodyReq, UpdateUserBodyReq } from '~/dto/req/user/createUpdateUserBody.req'
import { userService } from '~/services/user.service'

class UserController {
  createUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Create new user successful!',
      metaData: await userService.createUser(req.body)
    }).send(res)
  }

  getUserByEmail = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const email = req.query.email as string;
    return new CREATED({
      message: 'Get user successful',
      metaData: await userService.getUserByEmail(email)
    }).send(res);
  }

  getUserById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    return new CREATED({
      message: 'Get User successful',
      metaData: await userService.getUserByID(id)
    }).send(res);
  }

  getAllUsers = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    return new CREATED({
      message: 'Get page users successful',
      metaData: await userService.getAllUser(page, limit)
    }).send(res);
  }

  updateUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    return new CREATED({
      message: 'Update successful',
      metaData: await userService.updateUserByID(id, req.body)
    }).send(res);
  }

  restoreUser= async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string);
    return new CREATED({
      message: 'Restore user successful',
      metaData: await userService.restoreUser(id)
    }).send(res);
  }

  deleteUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    return new CREATED({
      message: 'Delete user successful',
      metaData: await userService.deleteUserByID(id)
    }).send(res);
  }

}

export const userController = new UserController()
