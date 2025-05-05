import { validate } from '../validation.middlewares'
import { checkSchema } from 'express-validator'
import { isRequired, isLength, isString, isEnum } from '../common.middlewares'
import { TopicType } from '~/constants/topic'
import { BadRequestError } from '~/core/error.response'
import { Course } from '~/entities/courses.entity'
import { In } from 'typeorm'

export const createTopicValidation = validate(
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
      },
      'topics.*.courseIds': {
        optional: true,
        isArray: {
          errorMessage: 'courseIds must be an array'
        },
        custom: {
          options: async (value: number[]) => {
            if (!value || value.length === 0) {
              return true
            }
            
            const courses = await Course.find({
              where: { id: In(value) }
            })

            if (courses.length !== value.length) {
              const existingCourseIds = courses.map(course => course.id)
              const nonExistingCourseIds = value.filter(id => !existingCourseIds.includes(id))
              throw new BadRequestError({ 
                message: `The following course IDs do not exist: ${nonExistingCourseIds.join(', ')}` 
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
