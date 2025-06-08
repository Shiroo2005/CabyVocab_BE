import { checkSchema } from 'express-validator'
import { ReportType } from '~/constants/report'
import { validate } from '../validation.middlewares'

export const validateCreateReport = validate(
  checkSchema({
    content: {
      in: ['body'],
      isString: {
        errorMessage: 'Content must be a string'
      },
      notEmpty: {
        errorMessage: 'Content cannot be empty'
      }
    },
    type: {
      in: ['body'],
      isIn: {
        options: [Object.values(ReportType)],
        errorMessage: `Type must be one of: ${Object.values(ReportType).join(', ')}`
      }
    }
  })
)
