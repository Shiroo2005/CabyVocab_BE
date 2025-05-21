import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { ReturnQueryFromVNPay } from 'vnpay'
import { vnpay } from '~/config/vnpay.config'
import { orderService } from '~/services/order.service'

class OrderController {
  vnpayReturn = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const verify = vnpay.verifyReturnUrl(req.query as ReturnQueryFromVNPay)
    await orderService.updateOrder(verify)

    console.log(process.env.HOST_FE)

    return res.redirect(`${process.env.HOST_FE}`)
  }
}

export const orderController = new OrderController()
