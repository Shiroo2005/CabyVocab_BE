import { isLength, isRequired, isString, isEnum } from '../common.middlewares'
import { isValidEnumValue } from '~/utils'
import { checkSchema } from 'express-validator'
import { WordPosition, WordRank } from '~/constants/word'
import { BadRequestError } from '~/core/error.response'
import { validate } from '../validation.middlewares'
import { Topic } from '~/entities/topic.entity'
import { In } from 'typeorm'


export const createWordValidation = validate(
  checkSchema(
    {
      words: {},
      'words.*.content': {
        trim: true,
        ...isRequired('content'),
        ...isString('content'),
        ...isLength({ fieldName: 'content', min: 1, max: 255 })
      },
      'words.*.pronunciation': {
        trim: true,
        ...isRequired('pronunciation'),
        ...isString('pronunciation'),
        ...isLength({ fieldName: 'pronunciation', min: 1, max: 255 })
      },
      'words.*.position': {
        optional: true,
        custom: {
          options: (value) => {
            if (!isValidEnumValue(value, WordPosition))
              throw new BadRequestError({message: 'position must be in enum WORD POSITION!'})
            return true
          }
        }
      },
      'words.*.meaning': {
        trim: true,
        ...isRequired('meaning'),
        ...isString('meaning'),
        ...isLength({ fieldName: 'meaning', min: 1, max: 255 })
      },
      'words.*.audio': {
        trim: true,
        optional: true,
        ...isString('audio'),
        ...isLength({ fieldName: 'audio', min: 1, max: 255 })
      },
      'words.*.image': {
        trim: true,
        optional: true,
        ...isString('image'),
        ...isLength({ fieldName: 'image', min: 1, max: 255 })
      },
      'words.*.rank': {
        optional: true,
        ...isEnum(WordRank, 'wordRank')
      },
      'words.*.example': {
        trim: true,
        optional: true,
        ...isString('example'),
        ...isLength({ fieldName: 'example', min: 1, max: 255 })
      },
      'words.*.translateExample': {
        trim: true,
        optional: true,
        ...isString('translate example'),
        ...isLength({ fieldName: 'translate example', min: 1, max: 255 })
      },
      'words.*.topicIds': {
        ...isRequired('topicId'),
        isArray: {
          errorMessage: 'topicID không hợp lệ'
        },
        custom: {
          options: async (value: number[]) => {
            const topics = await Topic.find({
              where: { id: In(value)}
            });
            
            if (topics.length !== value.length) {
              throw new BadRequestError({ message: 'topicIDs không hợp lệ' });
            }
            return true
          }
        }        
      }
    },
    ['body']
  )
)