import { checkSchema } from 'express-validator'
import { NotFoundRequestError } from '~/core/error.response'
import { Comment } from '~/entities/comment.entity'
import { isLength, isRequired } from '~/middlewares/common.middlewares'
import { validate } from '~/middlewares/validation.middlewares'

export const createCommentValidation = validate(
  checkSchema(
    {
      content: {
        ...isRequired('Content'),
        ...isLength({ fieldName: 'content', min: 0, max: 256 })
      },
      parentId: {
        optional: true,
        isNumeric: true,
        custom: {
          options: async (value) => {
            const foundComment = await Comment.findOne({
              where: {
                id: value
              }
            })

            if (!foundComment) throw new NotFoundRequestError('Parent Comment Id invalid')
          }
        }
      }
    },
    ['body']
  )
)
