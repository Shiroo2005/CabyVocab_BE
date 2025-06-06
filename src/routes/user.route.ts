import { userController } from '~/controllers/user.controller'
import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { createUserValidation } from '~/middlewares/user/createUser.middlewares'
import { accessTokenValidation, checkPermission } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { searchEmailValidation } from '~/middlewares/user/searchUser.middleware'
import { updateUserByIdValidation } from '~/middlewares/user/updateUser.middleware'
import { Resource } from '~/constants/access'
import { User } from '~/entities/user.entity'

const userRouter = express.Router()

// access token validation
userRouter.use(accessTokenValidation)

//POST
/**
 * @description : Create a new user
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : {
 *  email: string,
 *  username: string,
 *  password: string,
 *  roleId: number,
 *  avatar: string (URL from upload endpoint)
 * }
 */
userRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.USER)),
  createUserValidation,
  wrapRequestHandler(userController.createUser)
)

//GET
/**
 * @description : Get all users
 * @method : GET
 * @path : /
 * @header : Authorization
 * @query : {limit: number, page:number, fullName:string, roleName:string, status:userStatus, sort: string}
 * sort like id | -id
 * sort field must be in [id, fullName, username, email]
 * filter field must be in [
 *  
    username?: string
    roleName?: string
    status?: UserStatus
 * ]
 */
userRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: User.allowSortList })),
  wrapRequestHandler(userController.getAllUsers)
)

// Get user summary
userRouter.get(
  '/summary',
  wrapRequestHandler(checkPermission('readAny', Resource.USER)),
  wrapRequestHandler(userController.getUserStatisticsSummary)
)

/**
 * @description : Get user by email
 * @method : GET
 * @path : /search
 */
userRouter.get('/search', searchEmailValidation, wrapRequestHandler(userController.getUserByEmail))

/**
 * @description : Get user by id
 * @method : GET
 * @path : /:id
 * @header : Authorization
 * @params : id
 */
userRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(userController.getUserById))

//PUT

//PATCH
/**
 * @description : Restore user from deleted
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params: id
 */
userRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(userController.restoreUser))

/**
 * @description : Update user
 * @method : PATCH
 * @path : /:id
 * @header : Authorization
 * @params : id
 * @body : {
 *  email?: string
    username?: string
    avatar?: string
    roleId?: number
    status?: UserStatus
 * }
 */
userRouter.patch(
  '/:id',
  checkIdParamMiddleware,
  updateUserByIdValidation,
  wrapRequestHandler(userController.updateUser)
)

//DELETE
/**
 * @description : Delete user by id
 * @method : DELETE
 * @path : /:id
 * @header : Authorization
 */
userRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(userController.deleteUser))

export default userRouter
