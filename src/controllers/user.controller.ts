import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { userService } from '~/services/user.service'

class UserController {
  createUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Create new user successful!',
      metaData: await userService.createUser(req.body)
    }).send(res)
  }

  getUserByEmail = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const email = req.query.email as string
    return new SuccessResponse({
      message: 'Get user successful',
      metaData: await userService.getUserByEmail(email)
    }).send(res)
  }

  getUserById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    return new SuccessResponse({
      message: 'Get User successful',
      metaData: await userService.getUserByID(id)
    }).send(res)
  }

  getAllUsers = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: 'Get page users successful',
      metaData: await userService.getAllUser({
        ...req.query,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res)
  }

  updateUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    return new SuccessResponse({
      message: 'Update successful',
      metaData: await userService.updateUserByID(id, req.body)
    }).send(res)
  }

  restoreUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string)
    return new SuccessResponse({
      message: 'Restore user successful',
      metaData: await userService.restoreUser(id)
    }).send(res)
  }

  deleteUser = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params?.id)
    return new SuccessResponse({
      message: 'Delete user successful',
      metaData: await userService.deleteUserByID(id)
    }).send(res)
  }
}

export const userController = new UserController()
