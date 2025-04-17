import express from 'express'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { wordController } from '~/controllers/word.controller'
import { createWordValidation } from '~/middlewares/Word/createWords.middlewares'

const wordRouter = express.Router()

// access token validation
wordRouter.use(accessTokenValidation)

//GET

//POST
//checkpermission
wordRouter.post('/', createWordValidation, wrapRequestHandler(wordController.createWord))

//PATH

//PUT

//DELETE

export default wordRouter