import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'
import { isEnum } from '../common.middlewares'
import { PayoutStatus } from '~/constants/transaction'

export const updatePayoutBodyValidation = validate(
  checkSchema({
    status: {
      ...isEnum(PayoutStatus, 'status')
    }
  })
)
