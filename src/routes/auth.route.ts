import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { authController } from '~/controllers/auth.controller'
const authRouter = express.Router()

// GET
// authRouter.post('/register', wrapRequestHandler(registerController))

// POST
authRouter.post('/register', wrapRequestHandler(authController.register))
authRouter.post('/login', wrapRequestHandler(authController.login))
// PUT

// DELETE
export default authRouter
