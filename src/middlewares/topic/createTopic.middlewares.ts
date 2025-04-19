import { validate } from '../validation.middlewares'
import { checkSchema } from 'express-validator'
import { isRequired, isLength, isString, isEnum } from '../common.middlewares'
import { TopicType } from '~/constants/topic'
import { BadRequestError } from '~/core/error.response'

export const create_updateTopicValidation = validate(
  checkSchema(
    {
      topics: {
        custom: {
          options: (value) => {
            if (!Array.isArray(value) || value.length === 0) {
              throw new BadRequestError({ message: 'topics must contain at least 1 item' })
            }
            return true
          }
        }
      },
      'topics.*.title': {
        trim: true,
        ...isString('Topic title'),
        ...isLength({ fieldName: 'Topic title', min: 1, max: 100 }),
        ...isRequired('Title')
      },
      'topic.*.description': {
        trim: true,
        ...isString('Topic description'),
        ...isLength({ fieldName: 'content', min: 1, max: 255 })
      },
      'topic.*.thumbnail': {
        ...isString('Topic thumbnail')
      },
      'topic.*.type': {
        trim: true,
        ...isRequired('Topic type'),
        ...isEnum(TopicType, 'Topic type')
      }
    },
    ['body']
  )
)
