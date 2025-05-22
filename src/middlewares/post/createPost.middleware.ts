import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'

export const createPostValidation = validate(
  checkSchema({
    content: {
      in: ['body'],
      exists: {
        errorMessage: 'Content is required'
      },
      isString: {
        errorMessage: 'Content must be a string'
      },
      notEmpty: {
        errorMessage: 'Content cannot be empty'
      }
    },
    thumbnails: {
      in: ['body'],
      optional: true,
      isArray: {
        errorMessage: 'Thumbnails must be an array'
      }
    },
    'thumbnails.*': {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Each thumbnail must be a string'
      }
    },
    tags: {
      in: ['body'],
      optional: true,
      isArray: {
        errorMessage: 'Tags must be an array'
      }
    },
    'tags.*': {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Each tag must be a string'
      }
    }
  })
)
