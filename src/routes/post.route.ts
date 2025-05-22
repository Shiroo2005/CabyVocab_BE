import express from 'express'
import { postController } from '~/controllers/post.controller'
import { Post } from '~/entities/post.entity'
import { accessTokenValidation, checkVerifyUser } from '~/middlewares/auth.middlewares'
import {
  checkIdParamMiddleware,
  checkQueryMiddleware,
  parseSort,
  requireJsonContent
} from '~/middlewares/common.middlewares'
import { createCommentValidation } from '~/middlewares/exercise/comment/createComment.middlewares'
import { getChildCommentValidation } from '~/middlewares/exercise/comment/getChildComment.middlewares'
import { updateCommentValidation } from '~/middlewares/exercise/comment/updateComment.middlewares'
import { createPostValidation } from '~/middlewares/post/createPost.middleware'
import { updatePostValidation } from '~/middlewares/post/updatePost.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const postRouter = express.Router()

postRouter.use(accessTokenValidation)

//GET

/**
 * @description : Get all posts
 * @method : GET
 * @path : /
 *@Query :
 * {
 *     page?: number,
 *     limit?: number,
 *     sort?: FindOptionsOrder<Course>
 * }
 */
postRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Post.allowSortList })),
  wrapRequestHandler(postController.getAll)
)

/**
 * @description : get children comment
 * @method : GET
 * @path : /:id
 */
postRouter.get(
  '/:id/child-comment/:parentId',
  wrapRequestHandler(getChildCommentValidation),
  wrapRequestHandler(postController.getChildComment)
)

/**
 * @description : Get post by ID
 * @method : GET
 * @path : /:id
 * @params : {id}
 */
postRouter.get('/:id', wrapRequestHandler(checkIdParamMiddleware), wrapRequestHandler(postController.getById))

postRouter.use(checkVerifyUser)

//POST

postRouter.post(
  '/',
  wrapRequestHandler(requireJsonContent),
  createPostValidation,
  wrapRequestHandler(postController.create)
)

/**
 * @description : Vote topic
 * @method : POST
 * @path : /:id/like
 * @header : Authorization
 */
postRouter.post('/:id/like', checkIdParamMiddleware, wrapRequestHandler(postController.votePost))

/**
 * @description : Comment
 * @method : POST
 * @path : /:id/comment/
 * @header : Authorization
 */
postRouter.post(
  '/:id/comment',
  checkIdParamMiddleware,
  createCommentValidation,
  wrapRequestHandler(postController.createComment)
)
//PUT

//PATCH
postRouter.patch(
  '/:id',
  wrapRequestHandler(checkIdParamMiddleware),
  updatePostValidation,
  wrapRequestHandler(postController.update)
)

/**
 * @description : Update comment
 * @method : PATCH
 * @path : /:id/comment/
 * @header : Authorization
 */
postRouter.patch(
  '/:id/comment/:commentId',
  checkIdParamMiddleware,
  updateCommentValidation,
  wrapRequestHandler(postController.updateComment)
)

//DELETE
postRouter.delete('/:id', wrapRequestHandler(checkIdParamMiddleware), wrapRequestHandler(postController.delete))

/**
 * @description : Delete comment folder by id
 * @method : DELETE
 * @path : /:id
 */
postRouter.delete('/:id/comment/:commentId', wrapRequestHandler(postController.deleteComment))

/**
 * @description : UnVote topic
 * @method : DELETE
 * @path : /:id/unlinke
 * @header : Authorization
 */
postRouter.delete('/:id/unlike', checkIdParamMiddleware, wrapRequestHandler(postController.unVotePost))
