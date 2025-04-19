import express from 'express'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { wordController } from '~/controllers/word.controller'
import { createWordValidation } from '~/middlewares/word/createWords.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { updateWordValidation } from '~/middlewares/word/updateWord.middleware'
import { Word } from '~/entities/word.entity'

const wordRouter = express.Router()

// access token validation
wordRouter.use(accessTokenValidation)

//GET
//middlewares
wordRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Word.allowSortList })),
  wrapRequestHandler(wordController.getAllWords)
)
wordRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(wordController.getWordById))

//POST
//checkPermission?
wordRouter.post('/', createWordValidation, wrapRequestHandler(wordController.createWords))

//PATCH
wordRouter.patch('/:id', checkIdParamMiddleware, updateWordValidation, wrapRequestHandler(wordController.updateWord))
wordRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(wordController.restoreWord))

//PUT

//DELETE
wordRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(wordController.deleteWordById))

export default wordRouter
