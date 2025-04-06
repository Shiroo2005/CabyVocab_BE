import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { authController } from '~/controllers/auth.controller'
import { validate } from '~/middlewares/validation.middlewares'
import { loginValidation, refreshTokenValidation, registerValidation, tokenValidation } from '~/middlewares/validations/auth.validation'
import { verifyRefreshToken, verifyToken } from '~/middlewares/auth.middlewares'
const authRouter = express.Router()

// GET
authRouter.get('/account', validate(tokenValidation), verifyToken, wrapRequestHandler(authController.getAccount))


// POST
authRouter.post('/register', validate(registerValidation), wrapRequestHandler(authController.register))
authRouter.post('/login', validate(loginValidation), wrapRequestHandler(authController.login))
authRouter.post('/refresh', validate(refreshTokenValidation), verifyRefreshToken, wrapRequestHandler(authController.refreshToken))
// PUT

// DELETE
export default authRouter
