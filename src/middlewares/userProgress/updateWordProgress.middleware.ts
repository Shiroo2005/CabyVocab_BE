import { Request, Response, NextFunction } from 'express'
import { NotFoundRequestError } from '~/core/error.response'
import { UpdateWordProgressData } from '~/dto/req/wordProgress/updateWordProgressBody.req'
import { User } from '~/entities/user.entity'
import { checkSchema } from 'express-validator'
import { wordService } from '~/services/word.service'
import { validate } from '../validation.middlewares'
import { WordProgress } from '~/entities/word_progress.entity'

export const updateWordProgressValidation = async (req: Request, res: Response, next: NextFunction) => {
  validate(
    checkSchema({
      wordProgress: {
        isArray: true
      },
      'wordProgress.*.wrongCount': {
        isInt: {
          errorMessage: 'wrongCount must be an integer'
        },
        toInt: true
      },
      'wordProgress.*.wordId': {
        isInt: {
          errorMessage: 'wordId must be an integer'
        },
        toInt: true,
        custom: {
          options: async (wordId) => {
            if (!Object.keys(wordService.getWordById({ id: wordId })))
              throw new NotFoundRequestError('Word id invalid!')
          }
        }
      }
    })
  )
  const user = req.user as User

  const result: UpdateWordProgressData[] = await Promise.all(
    (req.body.wordProgress as { wordId: number; wrongCount: number; reviewedDate: Date }[]).map(
      async (_wordProgress) => {
        const foundWordProgress = await WordProgress.findOne({
          where: {
            word: { id: _wordProgress.wordId },
            user: { id: user.id }
          }
        })

        if (!foundWordProgress) throw new NotFoundRequestError('Word id invalid!')

        return {
          reviewedDate: _wordProgress.reviewedDate,
          wrongCount: _wordProgress.wrongCount,
          word: foundWordProgress
        }
      }
    )
  )

  req.body.wordProgress = result

  next()
}