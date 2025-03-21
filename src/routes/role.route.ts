import express from 'express'
import { roleController } from '~/controllers/role.controller'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
const roleRouter = express.Router()

// GET
roleRouter.get('/all', wrapRequestHandler(roleController.getAllRoles))
roleRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(roleController.getRole))

// authenticate....

// POST
roleRouter.post('/', wrapRequestHandler(roleController.createRole))
// PUT
roleRouter.put('/:id', checkIdParamMiddleware, wrapRequestHandler(roleController.putRole))

// DELETE
roleRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(roleController.deleteRoleById))

export default roleRouter
