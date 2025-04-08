import { userController } from '~/controllers/user.controller'
import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { createUserValidation } from '~/middlewares/user/createUser.middlewares'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'

const userRouter = express.Router()

// access token validation
userRouter.use(accessTokenValidation)

//POST
userRouter.post('/', createUserValidation, wrapRequestHandler(userController.createUser))

//GET
userRouter.get('/getByEmail', wrapRequestHandler(userController.getUserByEmail))

//PUT

//PATCH

//DELETE
export default userRouter
