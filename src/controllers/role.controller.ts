import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { CreateRoleBodyReq } from '~/dto/req/roles/createRoleBody.req'
import { CREATED, SuccessResponse } from '../core/success.response'
import { roleService } from '~/services/role.service'
import { UpdateRoleBodyReq } from '~/dto/req/roles/updateRoleBody.req'

class RoleController {
  createRole = async (req: Request<ParamsDictionary, any, CreateRoleBodyReq>, res: Response, next: NextFunction) => {
    return new CREATED({
      message: 'Create new role successful!',
      metaData: await roleService.createRole(req.body)
    }).send(res)
  }

  getAllRoles = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: 'Get all roles successful!',
      metaData: await roleService.getAllRole(req.query)
    }).send(res)
  }

  getRole = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: 'Get role by id successful!',
      metaData: await roleService.getRoleById(req.params?.id)
    }).send(res)
  }

  putRole = async (req: Request<ParamsDictionary, any, UpdateRoleBodyReq>, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: 'Update role by id successful!',
      metaData: await roleService.putRoleById({ ...req.body, id: req.params?.id })
    }).send(res)
  }

  deleteRoleById = async (
    req: Request<ParamsDictionary, any, UpdateRoleBodyReq>,
    res: Response,
    next: NextFunction
  ) => {
    return new SuccessResponse({
      message: 'Delete role by id successful!',
      metaData: await roleService.deleteRoleById({ id: req.params?.id })
    }).send(res)
  }
}

export const roleController = new RoleController()
