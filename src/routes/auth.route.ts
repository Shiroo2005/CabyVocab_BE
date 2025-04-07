import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { authController } from '~/controllers/auth.controller'
import { validate } from '~/middlewares/validation.middlewares'
import {
  accessTokenValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation
} from '~/middlewares/auth/auth.validation'
const authRouter = express.Router()

// GET
authRouter.get('/account', accessTokenValidation, wrapRequestHandler(authController.getAccount))

// POST
authRouter.post('/register', validate(registerValidation), wrapRequestHandler(authController.register))
authRouter.post('/login', validate(loginValidation), wrapRequestHandler(authController.login))
authRouter.post('/refresh', refreshTokenValidation, wrapRequestHandler(authController.refreshToken))
// PUT

// DELETE
export default authRouter
