import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { SuccessResponse } from '~/core/success.response'
import { systemEarningService } from '~/services/systemEarning.service'

class SystemEarningController {
  getSystemEarning = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    return new SuccessResponse({
      message: 'Get all system earning successful!',
      metaData: await systemEarningService.getAllSystemEarning({ ...req.parseQueryPagination, ...req.query })
    }).send(res)
  }
}

export const systemEarningController = new SystemEarningController()
