import { checkSchema } from 'express-validator'
import { isLength } from '../common.middlewares'
import { BadRequestError } from '~/core/error.response'
import { isValidEnumValue } from '~/utils'
import { TopicType } from '~/constants/topic'
import { validate } from '../validation.middlewares'
export const updateTopicValidation = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'title', min: 10, max: 255 })
      },
      description: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'description', min: 10, max: 255 })
      },
      thumbnail: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'thumbnail', max: 255 })
      },
      type: {
        optional: true,
        custom: {
          options: (value) => {
            // is enum in Topic Type
            if (!isValidEnumValue(value, TopicType))
              throw new BadRequestError({ message: 'field type must be in Enum TOPIC TYPE!' })
            return true
          }
        }
      },
      wordIds: {
        optional: true,
        isArray: true
      }
    },
    ['body']
  )
)
