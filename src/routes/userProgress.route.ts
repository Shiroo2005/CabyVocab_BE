import express from 'express'
import {
  completeTopicController,
  getUserProgressSummary,
  getWordReviewController,
  updateWordProgressController
} from '~/controllers/userProgress.controller'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkQueryMiddleware } from '~/middlewares/common.middlewares'
import { completeTopicValidation } from '~/middlewares/userProgress/completeTopic.middleware'
import { updateWordProgressValidation } from '~/middlewares/userProgress/updateWordProgress.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const userProgressRouter = express.Router()

userProgressRouter.use(accessTokenValidation)

//GET
/**
 * @description : Get word review
 * @method : GET
 * @path : /
 * @header : Authorization
 */
userProgressRouter.get('/word-review', checkQueryMiddleware(), wrapRequestHandler(getWordReviewController))

/**
 * @description : Get user progress summary
 * @method : GET
 * @path : /summary
 * @header : Authorization
 */
userProgressRouter.get('/summary', wrapRequestHandler(getUserProgressSummary))

//POST
/**
 * @description : Complete topic
 * @method : POST
 * @path : /
 * @header : Authorization
 * @query : {topicId: number}
 */
userProgressRouter.post('/complete-topic', completeTopicValidation, wrapRequestHandler(completeTopicController))

//PUT
/**
 * @description : Update word progress
 * @method : PUT
 * @path : /
 * @header : Authorization
 * @query : wordProgress: [
 *   {
 *     wordId: number,
 *     wrongCount: number,
 *     reviewedDate: Date
 *   }
 * ]
 */
userProgressRouter.put('/word', ...updateWordProgressValidation, wrapRequestHandler(updateWordProgressController))
