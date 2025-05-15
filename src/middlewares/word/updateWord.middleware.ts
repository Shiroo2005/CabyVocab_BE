import { checkSchema } from 'express-validator'
import { isLength, isString } from '../common.middlewares'
import { isValidEnumValue } from '~/utils'
import { WordPosition } from '~/constants/word'
import { BadRequestError } from '~/core/error.response'
import { validate } from '../validation.middlewares'

export const updateWordValidation = validate(
  checkSchema({
    content: {
      trim: true,
      optional: true,
      ...isString('content'),
      ...isLength({ fieldName: 'content', min: 1, max: 255 })
    },
    pronunciation: {
      trim: true,
      optional: true,
      ...isString('pronunciation'),
      ...isLength({ fieldName: 'pronunciation', min: 1, max: 255 })
    },
    position: {
      optional: true,
      custom: {
        options: (value) => {
          if (!isValidEnumValue(value, WordPosition))
            throw new BadRequestError({ message: 'position must be in enum WORD POSITION!' })
          return true
        }
      }
    },
    meaning: {
      trim: true,
      optional: true,
      ...isString('meaning'),
      ...isLength({ fieldName: 'meaning', min: 1, max: 255 })
    },
    audio: {
      trim: true,
      optional: true,
      ...isString('audio'),
      ...isLength({ fieldName: 'audio', min: 1, max: 255 })
    },
    image: {
      trim: true,
      optional: true,
      ...isString('image'),
      ...isLength({ fieldName: 'image', min: 1, max: 255 })
    },
    example: {
      trim: true,
      optional: true,
      ...isString('example'),
      ...isLength({ fieldName: 'example', min: 1, max: 255 })
    },
    translateExample: {
      trim: true,
      optional: true,
      ...isString('translate example'),
      ...isLength({ fieldName: 'translate example', min: 1, max: 255 })
    }
  })
)
