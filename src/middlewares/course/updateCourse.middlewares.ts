import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'
import { isEnum, isLength } from '../common.middlewares'
import { CourseLevel } from '~/constants/course'

export const updateCourseValidation = validate(
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
      target: {
        optional: true,
        isString: true,
        ...isLength({ fieldName: 'target', min: 10, max: 255 })
      },
      level: {
        optional: true,
        ...isEnum(CourseLevel, 'course level')
      },
      topics: {
        isArray: true,
        custom: {
          options: (
            topics: {
              id: number
              displayOrder: number
            }[]
          ) => {
            if (!isValidAndUniqueDisplayOrder(topics))
              throw new Error('Display order array need to be unique for each course and from 1 to N!')
            return true
          }
        }
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
