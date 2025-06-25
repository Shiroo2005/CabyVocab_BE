import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { CREATED } from '~/core/success.response'
import { User } from '~/entities/user.entity'
import { notificationService } from '~/services/notification.service'

class NotificationController {
  getAll = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const userId = (req.user as User).id as number

    return new CREATED({
      message: `Get user's notification successful`,
      metaData: await notificationService.getAllNotification(userId, { ...req.parseQueryPagination })
    }).send(res)
  }

  updateNotification = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const notificationId = parseInt(req.params.id)
    const userId = req.user?.id as number

    return new CREATED({
      message: `Update user's notification successful`,
      metaData: await notificationService.updateNotification(userId, notificationId, { ...req.body })
    }).send(res)
  }
}

export const notificationController = new NotificationController()
