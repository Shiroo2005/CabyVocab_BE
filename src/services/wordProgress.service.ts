import { now } from 'lodash'
import { EntityManager, LessThan } from 'typeorm'
import {
  DEFAULT_EASE_FACTOR,
  LEVEL_UP_FOR_EACH_LEVEL,
  MAX_EASE_FACTOR,
  WORD_MASTERY_LEVEL
} from '~/constants/userProgress'
import { CreateWordProgressBodyReq } from '~/dto/req/wordProgress/createWordProgressBody.req'
import { UpdateWordProgressData } from '~/dto/req/wordProgress/updateWordProgressBody.req'
import { User } from '~/entities/user.entity'
import { WordProgress } from '~/entities/wordProgress.entity'
import { DatabaseService } from './database.service'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '~/constants/pagination'

// Get database service for transactions
const databaseService = DatabaseService.getInstance()

class WordProgressService {
  createWordProgress = async (wordProgressData: CreateWordProgressBodyReq, manager?: EntityManager) => {
    const items = wordProgressData.wordProgress.map((progress) =>
      WordProgress.createWordProgress({ userId: wordProgressData.userId, wordId: progress.id as number })
    )

    // Use provided manager or fallback to Active Record pattern
    if (manager) {
      return await manager.save(WordProgress, items)
    } else {
      // Use Active Record pattern
      return await WordProgress.save(items)
    }
  }

  updateWordProgress = async ({ words, userId }: { words: UpdateWordProgressData[]; userId: number }) => {
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction() //start transaction

      const wordProgressMap = new Map()

      const wordProgresses = await Promise.all(
        words.map(async (wordBody) => {
          const foundProgress = await WordProgress.findOne({
            where: {
              word: { id: wordBody.wordId },
              user: { id: userId }
            },
            relations: ['word']
          })

          if (!foundProgress) {
            throw new NotFoundRequestError('Word progress not found')
          }

          const { newEaseFactor, newLevel } = this.calculateProgressByWrongCount(
            foundProgress.masteryLevel,
            foundProgress.easeFactor,
            wordBody.wrongCount || 0
          )

          foundProgress.easeFactor = newEaseFactor
          foundProgress.masteryLevel = newLevel
          foundProgress.nextReviewDate = WordProgress.calculateReviewDate(
            foundProgress.easeFactor,
            wordBody.reviewedDate
          )
          foundProgress.reviewCount += 1

          wordProgressMap.set(wordBody.wordId, foundProgress)
          return foundProgress
        })
      )

      const uniqueWordProgress = Array.from(wordProgressMap.values()).filter(
        (wordBody) => wordBody.easeFactor <= MAX_EASE_FACTOR
      )

      const result = await WordProgress.save(uniqueWordProgress)

      await this.updateUserProgress({ userId, manager: queryRunner.manager })

      await queryRunner.commitTransaction()

      return {
        updatedWords: result.map((wp) => ({
          wordId: wp.word.id,
          masteryLevel: wp.masteryLevel,
          easeFactor: wp.easeFactor,
          reviewCount: wp.reviewCount,
          nextReviewDate: wp.nextReviewDate
        })),
        summary: {
          totalUpdated: result.length
        }
      }
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when handle update word progress: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      await queryRunner.release()
    }
    //end transaction
  }

  createOrUpdateWordProgress = async (wordProgressData: CreateWordProgressBodyReq, manager?: EntityManager) => {
    const nowTime = new Date(now())
    const repo = manager ? manager.getRepository(WordProgress) : WordProgress.getRepository()

    const items = await Promise.all(
      wordProgressData.wordProgress.map(async (word) => {
        // check if word is already learn by user
        const foundWordProgress = await repo.findOne({
          where: {
            word: {
              id: word.id
            },
            user: {
              id: wordProgressData.userId
            }
          },
          relations: ['word', 'user']
        })

        if (foundWordProgress) {
          const { newEaseFactor, newLevel } = this.calculateProgressByWrongCount(
            foundWordProgress.masteryLevel,
            foundWordProgress.easeFactor,
            0
          )
          //mapping data
          foundWordProgress.easeFactor = newEaseFactor
          foundWordProgress.masteryLevel = newLevel
          foundWordProgress.nextReviewDate = WordProgress.calculateReviewDate(foundWordProgress.easeFactor, nowTime)
          foundWordProgress.reviewCount += 1

          return foundWordProgress
        } else {
          return WordProgress.createWordProgress({ userId: wordProgressData.userId, wordId: word.id as number })
        }
      })
    )

    // Use provided manager or fallback to Active Record pattern
    if (manager) {
      return await manager.save(WordProgress, items)
    } else {
      // Use Active Record pattern
      return await WordProgress.save(items)
    }
  }

  calculateProgressByWrongCount = (
    currentLevel: WORD_MASTERY_LEVEL,
    currentEaseFactor: number,
    wrongCount: number
  ): { newEaseFactor: number; newLevel: WORD_MASTERY_LEVEL } => {
    let newEaseFactor = currentEaseFactor
    let newLevel = currentLevel

    // check if easefactore is lower than min easefactor for this level will descrease this level
    switch (currentLevel) {
      case WORD_MASTERY_LEVEL.MASTERED:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.MASTERED.maxWrong) {
          newEaseFactor = currentEaseFactor - 1
          if (newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.MASTERED.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.REVIEWING
        } else {
          newEaseFactor = currentEaseFactor + 1
        }
        break

      case WORD_MASTERY_LEVEL.REVIEWING:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.REVIEWING.maxWrong) {
          newEaseFactor = currentEaseFactor - 1
          if (newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.REVIEWING.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.LEARNING
        } else {
          newEaseFactor = currentEaseFactor + 1
          if (newEaseFactor >= LEVEL_UP_FOR_EACH_LEVEL.MASTERED.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.MASTERED
        }
        break

      case WORD_MASTERY_LEVEL.LEARNING:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.LEARNING.maxWrong) {
          newEaseFactor = currentEaseFactor - 1
          if (newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.LEARNING.easeFactorForLevelUp) newLevel = WORD_MASTERY_LEVEL.NEW
        } else {
          newEaseFactor = currentEaseFactor + 1
          if (newEaseFactor >= LEVEL_UP_FOR_EACH_LEVEL.REVIEWING.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.REVIEWING
        }
        break

      case WORD_MASTERY_LEVEL.NEW:
        if (wrongCount > LEVEL_UP_FOR_EACH_LEVEL.NEW.maxWrong) {
          newEaseFactor = Math.max(currentEaseFactor - 1, DEFAULT_EASE_FACTOR)
          // if(newEaseFactor < LEVEL_UP_FOR_EACH_LEVEL.NEW.easeFactorForLevelUp) newLevel = WORD_MASTERY_LEVEL.NEW
        } else {
          newEaseFactor = currentEaseFactor + 1
          if (newEaseFactor >= LEVEL_UP_FOR_EACH_LEVEL.LEARNING.easeFactorForLevelUp)
            newLevel = WORD_MASTERY_LEVEL.LEARNING
        }
        break
      default:
        newLevel = WORD_MASTERY_LEVEL.NEW
    }
    return {
      newEaseFactor,
      newLevel
    }
  }

  getWordReview = async ({
    userId,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT
  }: {
    userId: number
    page?: number
    limit?: number
  }) => {
    const skip = (page - 1) * limit

    // Use Active Record pattern
    const [wordReview, total] = await WordProgress.findAndCount({
      where: {
        user: {
          id: userId
        },
        nextReviewDate: LessThan(new Date(now()))
      },
      relations: ['word'],
      select: {
        id: true,
        masteryLevel: true,
        easeFactor: true,
        reviewCount: true,
        nextReviewDate: true,
        word: {
          id: true,
          content: true,
          position: true,
          meaning: true,
          audio: true,
          image: true,
          pronunciation: true,
          example: true,
          translateExample: true
        }
      },
      skip,
      take: limit,
      order: {
        masteryLevel: 'ASC'
      }
    })

    const words = wordReview.map((progress) => ({
      word: progress.word,
      masteryLevel: progress.masteryLevel,
      reviewCount: progress.reviewCount,
      nextReviewDate: progress.nextReviewDate
    }))

    return {
      words,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  getSummary = async ({ userId }: { userId: number }) => {
    // Use Active Record pattern with query builder
    const queryBuilder = WordProgress.createQueryBuilder('wp')
      .select('wp.masteryLevel', 'masteryLevel')
      .addSelect('COUNT(wp.id)', 'count')
      .where('wp.user.id = :userId', { userId })
      .groupBy('wp.masteryLevel')

    const rawResult = await queryBuilder.getRawMany()
    const totalLearnWord = rawResult.reduce((sum, item) => sum + Number(item.count), 0)

    // Mapping raw to {masteryLevel, count}
    const countWordWithEachLevel = Object.keys(WORD_MASTERY_LEVEL)
      .filter((key) => isNaN(Number(key)))
      .map((level) => {
        return {
          level: level,
          wordCount:
            rawResult.find((r) => r.masteryLevel === WORD_MASTERY_LEVEL[level as keyof typeof WORD_MASTERY_LEVEL])
              ?.count ?? 0
        }
      })

    return {
      statistics: countWordWithEachLevel,
      totalLearnWord
    }
  }

  updateUserProgress = async ({ userId, manager }: { userId: number; manager?: EntityManager }) => {
    // Use provided manager or fallback to Active Record pattern
    const repo = manager ? manager.getRepository(User) : User.getRepository()

    const foundUser = await repo.findOne({
      where: {
        id: userId
      }
    })

    if (!foundUser) {
      throw new BadRequestError({ message: 'User not found!' })
    }

    // Update progress for this user
    // streak, last study date, total study day
    const now = new Date()
    const lastStudyDate = foundUser.lastStudyDate

    // Increase streak value if consecutive
    if (!lastStudyDate || now.getDay() - lastStudyDate.getDay() == 1) {
      foundUser.streak = (foundUser.streak ?? 0) + 1
      foundUser.totalStudyDay = (foundUser.totalStudyDay ?? 0) + 1
    }
    foundUser.lastStudyDate = now

    // Save only the progress fields, not the entire user object
    return manager
      ? await repo.update(userId, {
          streak: foundUser.streak,
          totalStudyDay: foundUser.totalStudyDay,
          lastStudyDate: foundUser.lastStudyDate
        })
      : await User.update(userId, {
          streak: foundUser.streak,
          totalStudyDay: foundUser.totalStudyDay,
          lastStudyDate: foundUser.lastStudyDate
        })
  }
}

export const wordProgressService = new WordProgressService()
