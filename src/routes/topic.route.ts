import express from 'express'
import { topicController } from '~/controllers/topic.controller'
import { Topic } from '~/entities/topic.entity'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { create_updateTopicValidation } from '~/middlewares/topic/createTopic.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const topicRouter = express.Router()

// access token validation
topicRouter.use(accessTokenValidation)

//GET
topicRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Topic.allowSortList })),
  wrapRequestHandler(topicController.getAllTopics)
)
topicRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(topicController.getTopicById))

//POST
topicRouter.post('/', create_updateTopicValidation, wrapRequestHandler(topicController.createTopic))

//PATH
topicRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(topicController.restoreTopic))
topicRouter.patch(
  '/:id',
  checkIdParamMiddleware,
  create_updateTopicValidation,
  wrapRequestHandler(topicController.updateTopic)
)

//PUT

//DELETE
topicRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(topicController.deleteTopic))

export default topicRouter
