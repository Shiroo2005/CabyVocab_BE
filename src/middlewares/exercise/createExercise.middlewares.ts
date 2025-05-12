import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'
import { isString } from '../common.middlewares'

export const createExerciseValidation = validate(
  checkSchema({
    name: {
      ...isString('name')
    }
  })
)
