import express from 'express'
import { orderController } from '~/controllers/order.controller'
import { wrapRequestHandler } from '~/utils/handler'

export const orderRouter = express.Router()

orderRouter.get('/vnpay-return', wrapRequestHandler(orderController.vnpayReturn))
