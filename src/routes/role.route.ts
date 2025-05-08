import express from 'express'
import { roleController } from '~/controllers/role.controller'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import {
  validateCreateRole,
  validateUpdateRole,
  checkRoleExists,
  validatePagination
} from '~/middlewares/role.middlewares'

const roleRouter = express.Router()

// GET
/**
 * @description : Get all roles with pagination
 * @method : GET
 * @path : /
 * @query : {page, limit}
 */
roleRouter.get('/', validatePagination, wrapRequestHandler(roleController.getAllRoles))

/**
 * @description : Get role by ID
 * @method : GET
 * @path : /:id
 * @params : {id}
 */
roleRouter.get('/:id', checkIdParamMiddleware, checkRoleExists, wrapRequestHandler(roleController.getRole))

// POST
/**
 * @description : Create new role
 * @method : POST
 * @path : /
 * @body : {name, description}
 */
roleRouter.post('/', accessTokenValidation, validateCreateRole, wrapRequestHandler(roleController.createRole))

// PUT
/**
 * @description : Update role by ID
 * @method : PUT
 * @path : /:id
 * @params : {id}
 * @body : {name, description}
 */
roleRouter.put(
  '/:id',
  accessTokenValidation,
  checkIdParamMiddleware,
  validateUpdateRole,
  wrapRequestHandler(roleController.putRole)
)

// DELETE
/**
 * @description : Delete role by ID
 * @method : DELETE
 * @path : /:id
 * @params : {id}
 */
roleRouter.delete(
  '/:id',
  accessTokenValidation,
  checkIdParamMiddleware,
  checkRoleExists,
  wrapRequestHandler(roleController.deleteRoleById)
)
export default roleRouter
