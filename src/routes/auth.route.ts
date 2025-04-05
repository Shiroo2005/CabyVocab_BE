import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { authController } from '~/controllers/auth.controller'
import { validate } from '~/middlewares/validation.middlewares'
import { loginValidation, registerValidation } from '~/utils/validate'
const authRouter = express.Router()

// GET
// authRouter.post('/register', wrapRequestHandler(registerController))

// POST
authRouter.post('/register', validate(registerValidation), wrapRequestHandler(authController.register))
authRouter.post('/login', validate(loginValidation), wrapRequestHandler(authController.login))
// PUT

// DELETE
export default authRouter
