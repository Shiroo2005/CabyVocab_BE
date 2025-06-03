import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { TargetType } from '~/constants/target'
import { BadRequestError } from '~/core/error.response'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateFolderBodyReq } from '~/dto/req/exercise/createFolderBody.req'
import { updateFolderBodyReq } from '~/dto/req/exercise/updateFolderBody.req'
import { User } from '~/entities/user.entity'
import { commentService } from '~/services/comment.service'
import { exerciseService } from '~/services/exercise.service'
import { orderService } from '~/services/order.service'
import { voteService } from '~/services/vote.service'
import { getIpUser } from '~/utils'

class ExerciseController {
  create = async (req: Request<ParamsDictionary, any, CreateFolderBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User

    const result = await exerciseService.createNewFolder(req.body, user.id as number)
    return new CREATED({
      message: 'Create new folder exercise successful',
      metaData: result
    }).send(res)
  }
  getAll = async (req: Request<ParamsDictionary, any, CreateFolderBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User

    return new SuccessResponse({
      message: 'Get all folder exercise successful',
      metaData: await exerciseService.getAllFolder(user.id as number, {
        ...req.query,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res)
  }

  getById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Get folder exercise by id successful',
      metaData: await exerciseService.getFolderById(user.id as number, id)
    }).send(res)
  }

  getOwnFolders = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User

    return new SuccessResponse({
      message: 'Get own folder by user successful',
      metaData: await exerciseService.getOwnFolder(user.id as number)
    }).send(res)
  }

  finishAttempQuiz = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const quizId = parseInt(req.params?.quizId)
    return new SuccessResponse({
      message: 'Update attempt quiz successful',
      metaData: await exerciseService.updateCountAttemptQuiz({ quizId, userId: user.id as number })
    }).send(res)
  }

  updateById = async (req: Request<ParamsDictionary, any, updateFolderBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Update folder by id successful',
      metaData: await exerciseService.updateFolder(user, id, req.body)
    }).send(res)
  }

  deleteById = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const user = req.user as User
    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Delete folder by id successful',
      metaData: await exerciseService.deleteFolderById(user.id as number, id)
    }).send(res)
  }

  voteFolder = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const folderId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Vote folder by id successful!',
      metaData: await voteService.vote({ userId: user.id as number, targetId: folderId, targetType: TargetType.FOLDER })
    }).send(res)
  }

  unVoteFolder = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const folderId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Unvote folder by id successful!',
      metaData: await voteService.unVote({
        userId: user.id as number,
        targetId: folderId,
        targetType: TargetType.FOLDER
      })
    }).send(res)
  }

  createComment = async (req: Request<ParamsDictionary, any, { content: string; parentId: number }>, res: Response) => {
    const folderId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Create comment successful!',
      metaData: await commentService.comment({
        user,
        targetId: folderId,
        targetType: TargetType.FOLDER,
        ...req.body
      })
    }).send(res)
  }

  getChildComment = async (
    req: Request<ParamsDictionary, any, { content: string; parentId: number }>,
    res: Response
  ) => {
    const parentId = req.params?.parentId == 'null' ? null : parseInt(req.params?.parentId)
    const topicId = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Get child comment by id successful!',
      metaData: await commentService.findChildComment(topicId, parentId, TargetType.FOLDER)
    }).send(res)
  }

  getOrderHistoryFolder = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const user = req.user as User

    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Get order history successful!',
      metaData: await exerciseService.getOrderHistoryByExerciseId(user.id as number, id, {
        ...req.query,
        sort: req.sortParsed
      })
    }).send(res)
  }

  updateComment = async (req: Request<ParamsDictionary, any, { content: string; parentId: number }>, res: Response) => {
    const folderId = parseInt(req.params?.id)

    if (!req.params?.commentId) throw new BadRequestError({ message: 'Comment id invalid' })

    const commentId = parseInt(req.params?.commentId)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Update comment successful!',
      metaData: await commentService.updateComment({
        user,
        targetId: folderId,
        targetType: TargetType.FOLDER,
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
      metaData: await exerciseService.deleteCommentFolder(user.id as number, commentId)
    }).send(res)
  }

  createOrderExercise = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const user = req.user as User

    const ipUser = getIpUser(req) || '127.0.0.1'

    const folderId = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Create new order successful!',
      metaData: await orderService.createNewOrderFolder(user.id as number, folderId, ipUser)
    }).send(res)
  }
}

export const exerciseController = new ExerciseController()
