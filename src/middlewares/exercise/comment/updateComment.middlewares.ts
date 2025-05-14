import { checkSchema } from 'express-validator'
import { isLength, isRequired } from '~/middlewares/common.middlewares'
import { validate } from '~/middlewares/validation.middlewares'

export const updateCommentValidation = validate(
  checkSchema(
    {
      content: {
        ...isRequired('Content'),
        ...isLength({ fieldName: 'content', min: 0, max: 256 })
      }
    },
    ['body']
  )
)
