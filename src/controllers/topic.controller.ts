import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { getTopicTypeList } from '~/constants/topic'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateTopicBodyReq } from '~/dto/req/topic/createTopicBody.req'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { User } from '~/entities/user.entity'
import { topicService } from '~/services/topic.service'

class TopicController {
  createTopics = async (req: Request<ParamsDictionary, any, CreateTopicBodyReq>, res: Response) => {
    return new CREATED({
      message: 'Create new topic successful!',
      metaData: await topicService.createTopics(req.body.topics, req.body.user)
    }).send(res)
  }

  updateTopic = async (req: Request<ParamsDictionary, any, UpdateTopicBodyReq>, res: Response) => {
    const topicId = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Update topic by id successful!',
      metaData: await topicService.updateTopic(topicId, req.body)
    }).send(res)
  }

  getTopicById = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const topicId = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Get topic by id successful!',
      metaData: await topicService.getTopicById({ id: topicId })
    }).send(res)
  }

  getAllTopics = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    return new SuccessResponse({
      message: 'Get all topics successful!',
      metaData: await topicService.getAllTopics({ ...req.query, ...req.parseQueryPagination, sort: req.sortParsed })
    }).send(res)
  }

  getTopicTypeList = async (req: Request, res: Response) => {
    return new SuccessResponse({
      message: 'Get all topics type successful!',
      metaData: {
        data: getTopicTypeList()
      }
    }).send(res)
  }

  deleteTopic = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Delete topic by id successful!',
      metaData: await topicService.deleteTopic({ id })
    }).send(res)
  }

  restoreTopic = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    return new SuccessResponse({
      message: 'Restore topic by id successful!',
      metaData: await topicService.restoreTopic({ id })
    }).send(res)
  }

  voteTopic = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const topicId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Vote topic by id successful!',
      metaData: await topicService.voteTopic({ userId: user.id as number, topicId })
    }).send(res)
  }

  unVoteTopic = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const topicId = parseInt(req.params?.id)

    const user = req.user as User

    return new SuccessResponse({
      message: 'Unvote topic by id successful!',
      metaData: await topicService.unVoteTopic({ userId: user.id as number, topicId })
    }).send(res)
  }
}

export const topicController = new TopicController()
