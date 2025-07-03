import express from 'express'
import { orderController } from '~/controllers/order.controller'
import { wrapRequestHandler } from '~/utils/handler'
import { accessTokenValidation, checkVerifyUser } from '~/middlewares/auth.middlewares'
export const orderRouter = express.Router()
orderRouter.use(accessTokenValidation)
orderRouter.use(checkVerifyUser)
orderRouter.get('/vnpay-return', wrapRequestHandler(orderController.vnpayReturn))
/**
 * @description : Cancel an order
 * @method : DELETE
 * @path : /:orderId
 * @header : Authorization
 */
orderRouter.delete('/:orderId', wrapRequestHandler(orderController.cancelOrder))