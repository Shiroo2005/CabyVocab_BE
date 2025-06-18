import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { ReturnQueryFromVNPay } from 'vnpay'
import { vnpay } from '~/config/vnpay.config'
import { Order } from '~/entities/order.entity'
import { User } from '~/entities/user.entity'
import { EVENTS } from '~/events/constants'
import eventBus from '~/events/eventBus'
import { orderService } from '~/services/order.service'

class OrderController {
  vnpayReturn = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const verify = vnpay.verifyReturnUrl(req.query as ReturnQueryFromVNPay)
    const order = await orderService.updateOrder(verify)

    console.log(process.env.HOST_FE)

    //emit event
    eventBus.emit(EVENTS.ORDER, {
      buyer: order.createdBy,
      ownerId: order.folder.createdBy.id,
      folderId: order.folder.id,
      order
    } as { buyer: User; ownerId: number; folderId: number; order: Order })

    res.json({}).status(200)
  }
}

export const orderController = new OrderController()
