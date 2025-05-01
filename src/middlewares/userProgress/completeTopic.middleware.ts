import { checkSchema } from 'express-validator'
import { topicService } from '~/services/topic.service'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { Request } from 'express'
import { validate } from '../validation.middlewares'
import _ from 'lodash'

export const completeTopicValidation = validate(
  checkSchema(
    {
      topicId: {
        isInt: {
          errorMessage: 'topicId must be an integer'
        },
        toInt: true,
        custom: {
          options: async (topicId, { req }) => {
            //if Topic exists
            const foundTopic = await topicService.getTopicById({ id: topicId })
            if (!foundTopic || !Object.keys(foundTopic).length) 
              throw new NotFoundRequestError('Topic id invalid');
            (req.body as CompleteTopicBodyReq).topic = foundTopic as Topic
                    
            //check if topic was complete before
            const isAlreadyDone = await topicService.isTopicAlreadyCompleted({
              topicId,
              userId: (req as Request).user?.id as number
            })
            if (isAlreadyDone) throw new BadRequestError({ message: 'Topic was completed before!' })
            return true
          }
        }
      }
    },
    ['body']
  )
)