import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'
import { isEnum, isLength, isRequired } from '../common.middlewares'
import _, { isNumber } from 'lodash'
import { CourseLevel } from '~/constants/course'
export const createCourseValidation = validate (
  checkSchema(
    {
      courses: {
        isArray: true,
        custom: {
          options: (value) => {
            if (!Array.isArray(value) || value.length === 0) {
              throw new Error('courses must contain at least 1 item')
            }
            return true
          },
          bail: true
        }
      },
      'courses.*.title': {
        ...isRequired('title'),
        isString: true,
        ...isLength({ fieldName: 'title', min: 10, max: 255 })
      },
      'courses.*.description': {
        ...isRequired('description'),
        isString: true,
        ...isLength({ fieldName: 'description', min: 10, max: 255 })
      },
      'courses.*.target': {
        ...isRequired('target'),
        isString: true,
        ...isLength({ fieldName: 'target', min: 10, max: 255 })
      },
      'courses.*.level': {
        optional: true,
        ...isEnum(CourseLevel, 'course level'),
      },
      'courses.*.topics': {
        isArray: true,
        custom: {
          options: (
            topics: {
              id: number
              displayOrder: number
            }[]
          ) => {
            // require display order is unique for each course
            // display order array need to be from 1 - N
            if (!isValidAndUniqueDisplayOrder(topics))
              throw new Error('Display order array need to be unique for each course and from 1 to N!')

            return true
          }
        }
      },
      'courses.*.topics.*.id': {
        ...isNumber
      },
      'courses.*.topics.*.displayOrder': {
        ...isNumber
      }
    },
    ['body']
  )
)



export const isValidAndUniqueDisplayOrder = (topics: { id: number; displayOrder: number }[]): boolean => {
  const orders = topics.map((t) => t.displayOrder)
  const unique = new Set(orders)

  if (unique.size !== orders.length) return false

  let max = 0
  for (const order of orders) {
    if (order <= 0) return false
    if (order > max) max = order
  }

  return max === orders.length
}