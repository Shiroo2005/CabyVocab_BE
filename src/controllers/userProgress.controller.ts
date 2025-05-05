import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { UpdateWordProgressBodyReq } from '~/dto/req/wordProgress/updateWordProgressBody.req'
import { User } from '~/entities/user.entity'
import { topicService } from '~/services/topic.service'
import { wordProgressService } from '~/services/wordProgress.service'

export const completeTopicController = async (
  req: Request<ParamsDictionary, any, CompleteTopicBodyReq>,
  res: Response
) => {
  const user = req.user as User
  return new CREATED({
    message: 'Create complete topic successful!',
    metaData: await topicService.completedTopic({ ...req.body, userId: user.id as number })
  }).send(res)
}

export const updateWordProgressController = async (
  req: Request<ParamsDictionary, any, UpdateWordProgressBodyReq>,
  res: Response
) => {
  const user = req.user as User
  return new SuccessResponse({
    message: 'Update word progress successful!',
    metaData: await wordProgressService.updateWordProgress({ words: req.body.wordProgress, userId: user.id as number })
  }).send(res)
}

export const getWordReviewController = async (req: Request, res: Response) => {
  const user = (req as Request).user as User

  return new SuccessResponse({
    message: 'Get word review successful!',
    metaData: await wordProgressService.getWordReview({ userId: user.id as number })
  }).send(res)
}

export const getUserProgressSummary = async (req: Request, res: Response) => {
  const user = (req as Request).user as User

  return new SuccessResponse({
    message: 'Get user progress summary successful!',
    metaData: await wordProgressService.getSummary({ userId: user.id as number })
  }).send(res)
}
