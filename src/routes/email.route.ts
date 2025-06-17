import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { sendVerificationEmailValidation } from '~/middlewares/email/sendVerificationEmail.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const emailRouter = express.Router()

emailRouter.post('/change-password', wrapRequestHandler(authController.sendVerificationChangePassword))

emailRouter.use(accessTokenValidation)

//GET

//POST
emailRouter.post(
  '/send-verification',
  wrapRequestHandler(sendVerificationEmailValidation),
  wrapRequestHandler(authController.sendVerificationEmail)
)
