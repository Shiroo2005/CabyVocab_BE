import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { TargetType } from '~/constants/target'
import { BadRequestError } from '~/core/error.response'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreatePostBodyReq } from '~/dto/req/post/createPostBody.req'
import { UpdatePostBodyReq } from '~/dto/req/post/updatePostBody.req'
import { User } from '~/entities/user.entity'
import { commentService } from '~/services/comment.service'
import { postService } from '~/services/post.service'
import { voteService } from '~/services/vote.service'

class PostController {
  getById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User

    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Get post by id successful!',
      metaData: await postService.getPostById(user.id as number, id)
    }).send(res)
  }

  getAll = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User

    return new SuccessResponse({
      message: 'Get post by id successful!',
      metaData: await postService.getAllPost(user.id as number, {
        ...req.parseQueryPagination,
        sort: req.sortParsed,
        ...req.query
      })
    }).send(res)
  }

  create = async (req: Request<ParamsDictionary, any, CreatePostBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User

    return new CREATED({
      message: 'Create post successful!',
      metaData: await postService.create(user.id as number, req.body)
    }).send(res)
  }

  update = async (req: Request<ParamsDictionary, any, UpdatePostBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User

    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Update post successful!',
      metaData: await postService.update(user.id as number, id, req.body)
    }).send(res)
  }

  delete = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User

    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Delete post successful!',
      metaData: await postService.deleteById(user.id as number, id)
    }).send(res)
  }

  votePost = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const postId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Vote post by id successful!',
      metaData: await voteService.vote({ user, targetId: postId, targetType: TargetType.POST })
    }).send(res)
  }

  getChildComment = async (
    req: Request<ParamsDictionary, any, { content: string; parentId: number }>,
    res: Response
  ) => {
    const parentId = req.params?.parentId == 'null' ? null : parseInt(req.params?.parentId)
    const postId = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Get child comment by id successful!',
      metaData: await commentService.findChildComment(postId, parentId, TargetType.POST)
    }).send(res)
  }

  updateComment = async (req: Request<ParamsDictionary, any, { content: string; parentId: number }>, res: Response) => {
    const postId = parseInt(req.params?.id)

    if (!req.params?.commentId) throw new BadRequestError({ message: 'Comment id invalid' })

    const commentId = parseInt(req.params?.commentId)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Update comment successful!',
      metaData: await commentService.updateComment({
        user,
        targetId: postId,
        targetType: TargetType.POST,
        commentId,

        ...req.body
      })
    }).send(res)
  }

  deleteComment = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    if (!req.params?.commentId) throw new BadRequestError({ message: 'Comment id invalid' })

    const commentId = parseInt(req.params?.commentId)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Delete comment successful!',
      metaData: await postService.deleteCommentPost(user.id as number, commentId)
    }).send(res)
  }

  unVotePost = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const postId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Unvote post by id successful!',
      metaData: await voteService.unVote({
        user,
        targetId: postId,
        targetType: TargetType.POST
      })
    }).send(res)
  }

  createComment = async (req: Request<ParamsDictionary, any, { content: string; parentId: number }>, res: Response) => {
    const postId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Create comment successful!',
      metaData: await commentService.comment({
        user,
        targetId: postId,
        targetType: TargetType.POST,
        ...req.body
      })
    }).send(res)
  }
}

export const postController = new PostController()
