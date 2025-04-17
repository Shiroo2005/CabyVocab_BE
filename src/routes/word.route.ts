import express from 'express'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { wordController } from '~/controllers/word.controller'
import { createWordValidation } from '~/middlewares/Word/createWords.middlewares'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'

const wordRouter = express.Router()

// access token validation
wordRouter.use(accessTokenValidation)

//GET
//middlewares
wordRouter.get('/', wrapRequestHandler(wordController.getAllWords))
wordRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(wordController.getWordById))

//POST
//checkPermission?
wordRouter.post('/', createWordValidation, wrapRequestHandler(wordController.createWord))

//PATCH
wordRouter.patch('/:id', checkIdParamMiddleware, createWordValidation, wrapRequestHandler(wordController.updateWord))
wordRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(wordController.restoreWord))

//PUT

//DELETE
wordRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(wordController.deleteWordById))

export default wordRouter