import { checkSchema } from 'express-validator'
import { validate } from '../validation.middlewares'
import { isString } from '../common.middlewares'

export const updateExerciseValidation = validate(
  checkSchema({
    name: {
      optional: true,
      ...isString('name')
    },
    quizzes: {
      optional: true,
      isArray: true
    },
    'quizzes.*.title': {
      ...isString('quizzes.*.title')
    },
    'quizzes.*.question': {},
    flaseCards: {
      optional: true,
      isArray: true
    },
    'flashCards.*.frontContent': {
      ...isString('flashCards.*.frontContent')
    },
    'flashCards.*.frontImage': {
      ...isString('flashCards.*.frontImage')
    },
    'flashCards.*.backContent': {
      ...isString('flashCards.*.backContent')
    },
    'flashCards.*.backImage': {
      ...isString('flashCards.*.backImage')
    }
  })
)
