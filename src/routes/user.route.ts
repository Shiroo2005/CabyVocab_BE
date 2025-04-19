import { userController } from '~/controllers/user.controller'
import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { createUserValidation } from '~/middlewares/user/createUser.middlewares'
import { accessTokenValidation, checkPermission } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { searchEmailValidation } from '~/middlewares/user/searchUser.middleware'
import { updateUserByIdValidation } from '~/middlewares/user/updateUser.middleware'
import { Resource } from '~/constants/access'

const userRouter = express.Router()

// access token validation
userRouter.use(accessTokenValidation)

//POST
userRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.USER)),
  createUserValidation,
  wrapRequestHandler(userController.createUser)
)

//GET
userRouter.get('/', wrapRequestHandler(userController.getAllUsers))

userRouter.get('/search', searchEmailValidation, wrapRequestHandler(userController.getUserByEmail))

userRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(userController.getUserById))

//PUT

//PATCH
userRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(userController.restoreUser))

userRouter.patch(
  '/:id',
  checkIdParamMiddleware,
  updateUserByIdValidation,
  wrapRequestHandler(userController.updateUser)
)

//DELETE
userRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(userController.deleteUser))

export default userRouter
