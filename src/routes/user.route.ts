import { userController } from '~/controllers/user.controller'
import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { createUserValidation } from '~/middlewares/user/createUser.middlewares'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { searchEmailValidation } from '~/middlewares/user/searchUser.middleware'

const userRouter = express.Router()

// access token validation
//userRouter.use(accessTokenValidation)

//POST
userRouter.post('/', createUserValidation, wrapRequestHandler(userController.createUser))

//GET
userRouter.get('/all', wrapRequestHandler(userController.getAllUsers));

userRouter.get('/search', searchEmailValidation, wrapRequestHandler(userController.getUserByEmail));

userRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(userController.getUserById))

//PUT
//userRouter.put('/:id', wrapRequestHandler(userController.updateUser));
//PATCH
//??userRouter.patch('/restore', wrapRequestHandler(userController.<...........>));
//only full_name, avatar, status
userRouter.patch('/:id', wrapRequestHandler(userController.updateUser));

//DELETE
//deleteAt?, user_courses
//userRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(userController.))

export default userRouter
