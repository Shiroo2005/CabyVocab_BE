import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { wrapRequestHandler } from '~/utils/handler'

export const oAuthRouter = express.Router()

oAuthRouter.post('/google', wrapRequestHandler(authController.oauthLoginController))

// oAuthRouter.get('/:google/callback', wrapRequestHandler(authController.oauthLoginCallbackController))
