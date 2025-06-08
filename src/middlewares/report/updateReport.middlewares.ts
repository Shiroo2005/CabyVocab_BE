import { checkSchema } from 'express-validator'
import { ReportStatus } from '~/constants/report'
import { validate } from '../validation.middlewares'

export const validateUpdateReport = validate(
  checkSchema({
    status: {
      in: ['body'],
      isIn: {
        options: [Object.values(ReportStatus)],
        errorMessage: `Status must be one of: ${Object.values(ReportStatus).join(', ')}`
      }
    }
  })
)
