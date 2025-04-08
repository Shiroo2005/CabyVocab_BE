import express from 'express'
import { roleController } from '~/controllers/role.controller'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { 
    validateCreateRole, 
    validateUpdateRole, 
    checkRoleExists, 
    isAdmin,
    validatePagination 
  } from '~/middlewares/role.middlewares'

const roleRouter = express.Router()

// GET
roleRouter.get('/all', validatePagination, wrapRequestHandler(roleController.getAllRoles))

roleRouter.get('/:id', checkIdParamMiddleware, checkRoleExists, wrapRequestHandler(roleController.getRole))

// POST - Create new role (admin only)
roleRouter.post('/', 
  accessTokenValidation,
 // isAdmin,
  validateCreateRole, 
  wrapRequestHandler(roleController.createRole)
)

// PUT - Update role (admin only)
roleRouter.put('/:id', 
  accessTokenValidation,
 // isAdmin,
  checkIdParamMiddleware, 
  validateUpdateRole, 
  wrapRequestHandler(roleController.putRole)
)

// DELETE - Delete role (admin only)
roleRouter.delete('/:id', 
  accessTokenValidation,
 // isAdmin,
  checkIdParamMiddleware, 
  checkRoleExists, 
  wrapRequestHandler(roleController.deleteRoleById)
)
export default roleRouter
