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

// GET
/**
 * @description : Get all words
 * @method : GET
 * @path : /
 * @header : 
 * @query : 
 * { 
 *  page?: number, 
 *  limit?: number
 *  content?: string
    pronunciation?: string
    meaning?: string
    position?: WordPosition
    rank?: WordRank
    example?: string
    translateExample?: string
    sort?: FindOptionsOrder<Word> (-id,+content)
 * }
 */
wordRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Word.allowSortList })),
  wrapRequestHandler(wordController.getAllWords)
)


/**
 * @description : Get word by id
 * @method : GET
 * @path : /:id
 */
wordRouter.get(
  '/:id', 
  checkIdParamMiddleware, 
  wrapRequestHandler(wordController.getWordById)
)

//POST
//checkPermission?
/**
 * @description : Create new words
 * @method : POST
 * @path : /
 * @header : Admin
 * @body : {
        content: string
        pronunciation: string
        meaning: string
        position?: WordPosition
        audio?: string
        image?: string
        rank?: WordRank
        example?: string
        translateExample?: string
 * }[]
 */
wordRouter.post('/', createWordValidation, wrapRequestHandler(wordController.createWords))

//PATCH

/**
 * @description : Update word
 * @method : PATCH
 * @path : /:id
 * @header : Authorization
 * @param: id
 * @body :
        content?: string
        pronunciation?: string
        meaning?: string
        position?: WordPosition
        audio?: string
        image?: string
        rank?: WordRank
        example?: string
        translateExample?: string
 *
 */
wordRouter.patch(
  '/:id', 
  checkIdParamMiddleware,
  updateWordValidation, 
  wrapRequestHandler(wordController.updateWord)
)

/**
 * @description : Restore word from deleted
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params: id
 */
wordRouter.patch(
  '/:id/restore', 
  checkIdParamMiddleware, 
  wrapRequestHandler(wordController.restoreWord)
)

//PUT

//DELETE
/**
 * @description : Delete word by id
 * @method : DELETE
 * @path : /:id
 * @param : id
 * @header : Authorization
 */
wordRouter.delete(
  '/:id', 
  checkIdParamMiddleware, 
  wrapRequestHandler(wordController.deleteWordById)
)

export default wordRouter
