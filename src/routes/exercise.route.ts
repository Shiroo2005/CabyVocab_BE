import express from 'express'
import { Resource } from '~/constants/access'
import { exerciseController } from '~/controllers/exercise.controller'
import { Folder } from '~/entities/folder.entity'
import { Order } from '~/entities/order.entity'
import { accessTokenValidation, checkPermission, checkVerifyUser } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { createCommentValidation } from '~/middlewares/exercise/comment/createComment.middlewares'
import { getChildCommentValidation } from '~/middlewares/exercise/comment/getChildComment.middlewares'
import { updateCommentValidation } from '~/middlewares/exercise/comment/updateComment.middlewares'
import { createExerciseValidation } from '~/middlewares/exercise/createExercise.middlewares'
import { updateExerciseValidation } from '~/middlewares/exercise/updateExercise.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

export const exerciseRouter = express.Router()

//accesstoken
exerciseRouter.use(accessTokenValidation)
exerciseRouter.use(checkVerifyUser)

//GET
/**
 * @description : Get exercise by id
 * @method : GET
 * @path : /:id
 */
exerciseRouter.get(
  '/:id',
  wrapRequestHandler(checkPermission('readAny', Resource.EXERCISE)),
  checkIdParamMiddleware,
  wrapRequestHandler(exerciseController.getById)
)

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
  wrapRequestHandler(checkPermission('readAny', Resource.EXERCISE)),
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Folder.allowSortList })),
  wrapRequestHandler(exerciseController.getAll)
)

/**
 * @description : get children comment
 * @method : GET
 * @path : /:id
 */
exerciseRouter.get(
  '/:id/child-comment/:parentId',
  wrapRequestHandler(getChildCommentValidation),
  wrapRequestHandler(exerciseController.getChildComment)
)

/**
 * @description : get order history list
 * @method : GET
 * @path : /order-history/:id
 *  * @query : {limit: number, page:number, bankName, sort: string}
 * sort like id | -id
 * sort field must be in [id, fullName, username, email]
 * filter field must be in [
 *  
    username?: string
    roleName?: string
    status?: UserStatus
 * ]
 */
exerciseRouter.get(
  '/order-history/:id',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Order.allowSortList })),
  wrapRequestHandler(exerciseController.getOrderHistoryFolder)
)

//POST
/**
 * @description : Create new folder
 * @method : POST
 * @path : /:new-folder
 * @body : {
 *  name: string
 *  price: number
 * }
 */
exerciseRouter.post('/new-folder', createExerciseValidation, wrapRequestHandler(exerciseController.create))

/**
 * @description : Create new order
 * @method : POST
 * @path : /:new-order
 * @body : {
 *  name: string
 * }
 */
exerciseRouter.post('/:id/new-order', wrapRequestHandler(exerciseController.createOrderExercise))

/**
 * @description : Comment
 * @method : POST
 * @path : /:id/comment/
 * @header : Authorization
 */
exerciseRouter.post(
  '/:id/comment',
  checkIdParamMiddleware,
  createCommentValidation,
  wrapRequestHandler(exerciseController.createComment)
)

/**
 * @description : Vote exercise
 * @method : POST
 * @path : /:id/like
 * @header : Authorization
 */
exerciseRouter.post('/:id/like', checkIdParamMiddleware, wrapRequestHandler(exerciseController.voteFolder))

//PUT

//PATCH

/**
 * @description : Update comment
 * @method : PUT
 * @path : /:id/comment/
 * @header : Authorization
 */
exerciseRouter.put(
  '/:id/comment/:commentId',
  checkIdParamMiddleware,
  updateCommentValidation,
  wrapRequestHandler(exerciseController.updateComment)
)
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

/**
 * @description : Delete comment folder by id
 * @method : DELETE
 * @path : /:id
 */
exerciseRouter.delete('/:id/comment/:commentId', wrapRequestHandler(exerciseController.deleteComment))

/**
 * @description : UnVote topic
 * @method : DELETE
 * @path : /:id/unlinke
 * @header : Authorization
 */
exerciseRouter.delete('/:id/unlike', checkIdParamMiddleware, wrapRequestHandler(exerciseController.unVoteFolder))
