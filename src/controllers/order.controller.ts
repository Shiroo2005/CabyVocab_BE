import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { vnpay } from '~/config/vnpay.config'
import { Order } from '~/entities/order.entity'
import { User } from '~/entities/user.entity'
import { EVENTS } from '~/events-handler/constants'
import eventBus from '~/events-handler/eventBus'
import { orderService } from '~/services/order.service'
import { SuccessResponse } from '~/core/success.response'

class OrderController {
  vnpayReturn = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const verify = (await vnpay()).verifyReturnUrl(req.query as any)

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
  // Phương thức kiểm tra trạng thái đơn hàng
  checkOrderStatus = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const folderId = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Get order status successful',
      metaData: await orderService.getOrderStatus(user.id as number, folderId)
    }).send(res)
  }

  // Phương thức hủy đơn hàng
  cancelOrder = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const orderId = req.params.orderId

    return new SuccessResponse({
      message: 'Cancel order successful',
      metaData: await orderService.cancelOrder(user.id as number, orderId)
    }).send(res)
  }
}

export const orderController = new OrderController()
