import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateFolderBodyReq } from '~/dto/req/exercise/createFolderBody.req'
import { updateFolderBodyReq } from '~/dto/req/exercise/updateFolderBody.req'
import { User } from '~/entities/user.entity'
import { exerciseService } from '~/services/exercise.service'

class ExerciseController {
  create = async (req: Request<ParamsDictionary, any, CreateFolderBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User

    const result = await exerciseService.createNewFolder(req.body, user.id as number)
    return new CREATED({
      message: 'Create new folder exercise successful',
      metaData: result
    }).send(res)
  }
  getAll = async (req: Request<ParamsDictionary, any, CreateFolderBodyReq>, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: 'Get all folder exercise successful',
      metaData: await exerciseService.getAllFolder({
        ...req.query,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res)
  }

  getById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Get folder exercise by id successful',
      metaData: await exerciseService.getFolderById(id)
    }).send(res)
  }

  updateById = async (req: Request<ParamsDictionary, any, updateFolderBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Update folder by id successful',
      metaData: await exerciseService.updateFolder(user, id, req.body)
    }).send(res)
  }

  deleteById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Delete folder by id successful',
      metaData: await exerciseService.deleteFolderById(user.id as number, id)
    }).send(res)
  }
}

export const exerciseController = new ExerciseController()
