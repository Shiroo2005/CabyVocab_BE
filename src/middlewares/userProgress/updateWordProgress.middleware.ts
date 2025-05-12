import { Request, Response, NextFunction } from 'express'
import { NotFoundRequestError } from '~/core/error.response'
import { UpdateWordProgressData } from '~/dto/req/wordProgress/updateWordProgressBody.req'
import { User } from '~/entities/user.entity'
import { checkSchema } from 'express-validator'
import { wordService } from '~/services/word.service'
import { validate } from '../validation.middlewares'
import { WordProgress } from '~/entities/wordProgress.entity'

// Create a validation schema for word progress updates
const wordProgressValidationSchema = checkSchema(
  {
    wordProgress: {
      isArray: {
        errorMessage: 'wordProgress must be an array'
      },
      notEmpty: {
        errorMessage: 'wordProgress cannot be empty'
      }
    },
    'wordProgress.*.wordId': {
      exists: {
        errorMessage: 'wordId is required'
      },
      isInt: {
        errorMessage: 'wordId must be an integer'
      },
      toInt: true,
      custom: {
        options: async (wordId) => {
          const word = await wordService.getWordById({ id: wordId })
          if (!word || Object.keys(word).length === 0) {
            throw new NotFoundRequestError('Word not found')
          }
          return true
        }
      }
    },
    'wordProgress.*.wrongCount': {
      optional: true,
      isInt: {
        options: { min: 0 },
        errorMessage: 'wrongCount must be a non-negative integer'
      },
      toInt: true,
      custom: {
        options: (value) => {
          return value === undefined || value >= 0
        }
      }
    },
    'wordProgress.*.reviewedDate': {
      exists: {
        errorMessage: 'reviewedDate is required'
      },
      isISO8601: {
        errorMessage: 'reviewedDate must be a valid ISO 8601 date'
      },
      toDate: true
    }
  },
  ['body']
)

// First validate the schema, then process the word progress data
export const updateWordProgressValidation = [
  validate(wordProgressValidationSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User

    try {
      const result: UpdateWordProgressData[] = await Promise.all(
        req.body.wordProgress.map(async (wordProgress: { wordId: number; reviewedDate: Date; wrongCount?: number }) => {
          const foundWordProgress = await WordProgress.findOne({
            where: {
              word: { id: wordProgress.wordId },
              user: { id: user.id }
            },
            relations: ['word']
          })

          if (!foundWordProgress) {
            throw new NotFoundRequestError(`Word progress not found for word ID: ${wordProgress.wordId}`)
          }

          return {
            reviewedDate: wordProgress.reviewedDate,
            wrongCount: wordProgress.wrongCount ?? 0,
            wordId: wordProgress.wordId
          }
        })
      )

      req.body.wordProgress = result
      next()
    } catch (error) {
      next(error)
    }
  }
]
