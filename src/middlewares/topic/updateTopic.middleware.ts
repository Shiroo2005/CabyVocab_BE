import { validate } from '../validation.middlewares'
import { checkSchema } from 'express-validator'
import { isRequired, isLength, isString, isEnum } from '../common.middlewares'
import { TopicType } from '~/constants/topic'

export const updateTopicValidation = validate(
  checkSchema(
    {
      title: {
        optional: true,
        trim: true,
        ...isString('Topic title'),
        ...isLength({ fieldName: 'Topic title', min: 1, max: 100 })
      },
      description: {
        optional: true,
        trim: true,
        ...isString('Topic description'),
        ...isLength({ fieldName: 'content', min: 1, max: 255 })
      },
      thumbnail: {
        optional: true,
        ...isString('Topic thumbnail')
      },
      type: {
        optional: true,
        trim: true,
        ...isRequired('Topic type'),
        ...isEnum(TopicType, 'Topic type')
      },
      wordIds: {
        isArray: {
          errorMessage: 'wordIds must be an array'
        }
      }
    },
    ['body']
  )
)
