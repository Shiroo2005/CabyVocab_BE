import express from 'express'
import { Resource } from '~/constants/access'
import { topicController } from '~/controllers/topic.controller'
import { Topic } from '~/entities/topic.entity'
import { accessTokenValidation, checkPermission } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { createCommentValidation } from '~/middlewares/topic/comment/createComment.middlewares'
import { getChildCommentValidation } from '~/middlewares/topic/comment/getChildComment.middlewares'
import { CreateCustomizeTopicMiddleware } from '~/middlewares/topic/createCustomizeTopic.middlewares'
import { createTopicValidation } from '~/middlewares/topic/createTopic.middlewares'
import { updateTopicValidation } from '~/middlewares/topic/updateTopic.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const topicRouter = express.Router()

// access token validation
topicRouter.use(accessTokenValidation)

//GET
/**
 * @description : get all topics own by admin
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
 * @description : get children comment
 * @method : GET
 * @path : /:id
 */
topicRouter.get(
  '/:id/child-comment/:parentId',
  wrapRequestHandler(getChildCommentValidation),
  wrapRequestHandler(topicController.getChildComment)
)

/**
 * @description : Get topic type
 * @method : GET
 * @path : /:type-list
 * @header : Authorization
 * @params : id
 */
topicRouter.get('/type-list', wrapRequestHandler(topicController.getTopicTypeList))

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
topicRouter.post(
  '/',
  wrapRequestHandler(checkPermission('createAny', Resource.TOPIC)),
  createTopicValidation,
  wrapRequestHandler(topicController.createTopics)
)

/**
 * @description : Create new topic by user
 * @method : POST
 * @path : /
 * @header : Authorization
 * @body : topics: [
 *  {
        title: string
        description: string
        thumbnail?: string
        type?: TopicType
        wordIds?: number[]
        isPublic?:boolean
 * }
    ]
 */
topicRouter.post(
  '/by-user/',
  wrapRequestHandler(checkPermission('createOwn', Resource.TOPIC)),
  createTopicValidation,
  wrapRequestHandler(CreateCustomizeTopicMiddleware),
  wrapRequestHandler(topicController.createTopics)
)

/**
 * @description : Vote topic
 * @method : POST
 * @path : /:id/like
 * @header : Authorization
 */
topicRouter.post('/:id/like', checkIdParamMiddleware, wrapRequestHandler(topicController.voteTopic))

/**
 * @description : UnVote topic
 * @method : POST
 * @path : /:id/unlinke
 * @header : Authorization
 */
topicRouter.post('/:id/unlike', checkIdParamMiddleware, wrapRequestHandler(topicController.unVoteTopic))

/**
 * @description : Comment
 * @method : POST
 * @path : /:id/comment/:parentId
 * @header : Authorization
 */
topicRouter.post(
  '/:id/comment',
  checkIdParamMiddleware,
  createCommentValidation,
  wrapRequestHandler(topicController.createComment)
)

//PATH
/**
 * @description : Restore topic by id
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params : id
 */
topicRouter.patch(
  '/:id/restore',
  wrapRequestHandler(checkPermission('updateAny', Resource.TOPIC)),
  checkIdParamMiddleware,
  wrapRequestHandler(topicController.restoreTopic)
)

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
  wrapRequestHandler(checkPermission('updateAny', Resource.TOPIC)),
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
topicRouter.delete(
  '/:id',
  wrapRequestHandler(checkPermission('deleteAny', Resource.TOPIC)),
  checkIdParamMiddleware,
  wrapRequestHandler(topicController.deleteTopic)
)

export default topicRouter
