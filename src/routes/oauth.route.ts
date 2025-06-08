import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { wrapRequestHandler } from '~/utils/handler'

export const oAuthRouter = express.Router()

oAuthRouter.get('/:provider', wrapRequestHandler(authController.oauthLoginController))

oAuthRouter.get('/:provider/callback', wrapRequestHandler(authController.oauthLoginCallbackController))
