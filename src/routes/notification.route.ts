import express from 'express'
import { notificationController } from '~/controllers/notification.controller'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const notificationRoute = express.Router()

notificationRoute.use(accessTokenValidation)

notificationRoute.get('', checkQueryMiddleware(), wrapRequestHandler(notificationController.getAll))

notificationRoute.patch(
  '/:id/read',
  checkIdParamMiddleware,
  wrapRequestHandler(notificationController.updateReadNotification)
)

export default notificationRoute
