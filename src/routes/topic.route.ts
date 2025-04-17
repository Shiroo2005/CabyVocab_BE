import express from 'express'
import { topicController } from '~/controllers/topic.controller'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware } from '~/middlewares/common.middlewares'
import { create_updateTopicValidation } from '~/middlewares/Topic/createTopic.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const topicRouter = express.Router()

// access token validation
topicRouter.use(accessTokenValidation)

//GET
topicRouter.get('/', wrapRequestHandler(topicController.getAllTopics))
topicRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(topicController.getTopicById))

//POST
topicRouter.post('/', create_updateTopicValidation, wrapRequestHandler(topicController.createTopic))

//PATH
topicRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(topicController.restoreTopic))
topicRouter.patch('/:id', checkIdParamMiddleware, create_updateTopicValidation, wrapRequestHandler(topicController.updateTopic))

//PUT

//DELETE
topicRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(topicController.deleteTopic))

export default topicRouter