import express from 'express'
import { registerController } from '~/controllers/user.controller'
import { wrapRequestHandler } from '~/utils/handler'
const authRouter = express.Router()

// GET
// authRouter.post('/register', wrapRequestHandler(registerController))

// POST

// PUT

// DELETE
export default authRouter
