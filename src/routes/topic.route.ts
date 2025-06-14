import express from 'express'
import { Resource } from '~/constants/access'
import { topicController } from '~/controllers/topic.controller'
import { Topic } from '~/entities/topic.entity'
import { accessTokenValidation, checkPermission } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { createTopicValidation } from '~/middlewares/topic/createTopic.middlewares'
import { updateTopicValidation } from '~/middlewares/topic/updateTopic.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const topicRouter = express.Router()

// access token validation
topicRouter.use(accessTokenValidation)

//GET
/**
 * @description : get all topics
 * @method : GET
 * @path : /
 * @query :
 * {
 *  page?: number,
 *  limit?: number,
 *  title?: string,
 *  description?: string,
 *  type?: TopicType,
 *  sort?: FindOptionsOrder<Topic>
 * }
 */
topicRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Topic.allowSortList })),
  wrapRequestHandler(topicController.getAllTopics)
)

/**
 * @description : Get topic type
 * @method : GET
 * @path : /:type-list
 * @header : Authorization
 * @params : id
 */
topicRouter.get('/type-list', wrapRequestHandler(topicController.getTopicTypeList))

/**Topic summary */
topicRouter.get(
  '/summary',
  wrapRequestHandler(checkPermission('readAny', Resource.TOPIC)),
  wrapRequestHandler(topicController.getTopicSummary)
)

/**
 * @description : Get topic by id
 * @method : GET
 * @path : /:id
 * @header : Authorization
 * @params : id
 */
topicRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(topicController.getTopicById))

//POST
/**
 * @description : Create new topic
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : topics: [
 *  {
        title: string
        description: string
        thumbnail?: string
        type?: TopicType
 * }
    ]
 */
topicRouter.post('/', createTopicValidation, wrapRequestHandler(topicController.createTopics))

//PATH
/**
 * @description : Restore topic by id
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params : id
 */
topicRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(topicController.restoreTopic))

/**
 * @description : Update topic by id
 * @method : PATCH
 * @path : /:id
 * @header : Authorization
 * @params : id
 * @body : {
 *  title: string
    description: string
    thumbnail?: string
    type?: TopicType
 * }
 */
topicRouter.patch(
  '/:id',
  checkIdParamMiddleware,
  updateTopicValidation,
  wrapRequestHandler(topicController.updateTopic)
)

//PUT

//DELETE
/**
 * @description : Delete topic by id
 * @method : DELETE
 * @path : /:id
 * @header : Authorization
 * @params : id
 */
topicRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(topicController.deleteTopic))

//GET
/**
 * @description : Get topic words
 * @method : GET
 * @path : /:id/words
 * @param : id
 * @header : Authorization
 */
topicRouter.get(
  '/:id/words',
  checkIdParamMiddleware,
  checkQueryMiddleware(),
  wrapRequestHandler(topicController.getTopicWords)
)

export default topicRouter
