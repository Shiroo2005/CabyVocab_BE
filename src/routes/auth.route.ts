import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { authController } from '~/controllers/auth.controller'
import {
  accessTokenValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation
} from '~/middlewares/auth.middlewares'
const authRouter = express.Router()

// GET
authRouter.get('/account', accessTokenValidation, wrapRequestHandler(authController.getAccount))

// POST
authRouter.post('/register', registerValidation, wrapRequestHandler(authController.register))
authRouter.post('/login', loginValidation, wrapRequestHandler(authController.login))
authRouter.post('/refresh', refreshTokenValidation, wrapRequestHandler(authController.refreshToken))
// PUT

// DELETE
export default authRouter
