import express from 'express'
import { exerciseController } from '~/controllers/exercise.controller'
import { Folder } from '~/entities/folder.entity'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { createExerciseValidation } from '~/middlewares/exercise/createExercise.middlewares'
import { updateExerciseValidation } from '~/middlewares/exercise/updateExercise.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

export const exerciseRouter = express.Router()

//accesstoken
exerciseRouter.use(accessTokenValidation)

//GET
/**
 * @description : Get exercise by id
 * @method : GET
 * @path : /:id
 */
exerciseRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(exerciseController.getById))

/**
 * @description : Get all exercise
 * @method : GET
 * @path : /
 * @query : page?:number, limit?:number
 * sort like id | -id
 * sort field must be in [name]
 * filter field must be in [
 * name:string
 * ]
 */
exerciseRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Folder.allowSortList })),
  wrapRequestHandler(exerciseController.getAll)
)

//POST
/**
 * @description : Create new folder
 * @method : POST
 * @path : /:new-folder
 * @body : {
 *  name: string
 * }
 */
exerciseRouter.post('/new-folder', createExerciseValidation, wrapRequestHandler(exerciseController.create))

/**
 * @description : Vote topic
 * @method : POST
 * @path : /:id/like
 * @header : Authorization
 */
exerciseRouter.post('/:id/like', checkIdParamMiddleware, wrapRequestHandler(exerciseController.voteFolder))

/**
 * @description : UnVote topic
 * @method : POST
 * @path : /:id/unlinke
 * @header : Authorization
 */
exerciseRouter.post('/:id/unlike', checkIdParamMiddleware, wrapRequestHandler(exerciseController.unVoteFolder))

//PUT

//PATCH
/**
 * @description : Update folder by id
 * @method : PATCH
 * @path : /:id
 * @body : {
 * }
 * {
    "name"?: string,
    "quizzes"?: [
        {
            "id": number,
            "title": string,
            "question": [
                {
                    "question": string
                    "options": string[]
                    correctAnswers:string[]
                    explanation?:string
                    image?: string
                    time?:string
                }
            ]
        }
    ],
    "flashCards"?: [
        {
            "frontContent": string,
            "frontImage": string,
            "backImage": string,
            "backContent": string
        }
    ]
}
 */
exerciseRouter.patch('/:id', updateExerciseValidation, wrapRequestHandler(exerciseController.updateById))

//DELETE
/**
 * @description : Delete folder by id
 * @method : DELETE
 * @path : /:id
 */
exerciseRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(exerciseController.deleteById))
