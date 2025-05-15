import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { topicQueryReq } from '~/dto/req/topic/topicQuery.req'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { Word } from '~/entities/word.entity'
import { wordService } from './word.service'
import { validate } from 'class-validator'
import { In } from 'typeorm'
import { CompletedTopic } from '~/entities/completedTopic.entity'
import { BadRequestError } from '~/core/error.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { DatabaseService } from './database.service'
import { wordProgressService } from './wordProgress.service'
import { WordTopic } from '~/entities/wordTopic.entity'
import { CourseTopic } from '~/entities/courseTopic.entity'

class TopicService {
  createTopics = async (topicsBody: TopicBody[]) => {
    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect() // Ensure connection is established
      await queryRunner.startTransaction()

      const topics = [] as Topic[]

      // Prepare all topics first
      for (const topic of topicsBody) {
        const newTopic = Topic.create({ ...topic })
        topics.push(newTopic)
      }

      // Validate before saving
      await validate(topics)

      // Save all topics in a single operation
      const savedTopics = await queryRunner.manager.save(topics)

      // Handle word associations and course associations if needed
      for (let i = 0; i < savedTopics.length; i++) {
        const topic = savedTopics[i]
        const wordIds = topicsBody[i].wordIds || []
        const courseIds = topicsBody[i].courseIds || []

        // Handle word associations
        if (wordIds && wordIds.length > 0) {
          // Create word-topic associations in bulk
          const wordTopics = wordIds.map((wordId) => ({
            topicId: topic.id,
            wordId: wordId
          }))

          await queryRunner.manager.getRepository(WordTopic).save(wordTopics)
        }

        // Handle course associations
        if (courseIds && courseIds.length > 0) {
          // For each course, find the highest existing display order
          const courseTopics = []

          for (const courseId of courseIds) {
            // Find the highest display order for this course
            const highestOrder = await queryRunner.manager
              .getRepository(CourseTopic)
              .createQueryBuilder('courseTopic')
              .where('courseTopic.courseId = :courseId', { courseId })
              .orderBy('courseTopic.displayOrder', 'DESC')
              .getOne()

            // Calculate the next display order (either increment or start at 0)
            const nextDisplayOrder = highestOrder ? highestOrder.displayOrder + 1 : 0

            // Create the new course-topic association
            courseTopics.push({
              topic: { id: topic.id },
              course: { id: courseId },
              displayOrder: nextDisplayOrder
            })
          }

          await queryRunner.manager.getRepository(CourseTopic).save(courseTopics)
        }
      }

      await queryRunner.commitTransaction()
      return savedTopics
    } catch (err) {
      // Only rollback if transaction is active
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when creating topics: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      // Always release the queryRunner, regardless of success or failure
      await queryRunner.release()
    }
  }

  getTopicById = async ({ id }: { id: number }) => {
    const res = await Topic.findOne({
      where: {
        id
      },
      relations: ['wordTopics', 'wordTopics.word']
    })

    if (!res) return {}

    const words = res.wordTopics?.map((wordTopic) => wordTopic.word) || []

    const result = {
      ...res,
      words,
      wordTopics: undefined
    }

    return result
  }

  getAllTopics = async ({ page = 1, limit = 10, title, description, type, sort }: topicQueryReq) => {
    const skip = (page - 1) * limit

    const [topics, total] = await Topic.findAndCount({
      skip,
      take: limit,
      where: {
        title,
        description,
        type
      },
      order: sort,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        type: true
      }
    })

    return {
      topics,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  updateTopic = async (id: number, { title, description, thumbnail, type, wordIds }: UpdateTopicBodyReq) => {
    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()
      // First update the basic topic properties

      await queryRunner.manager.update(Topic, id, {
        title,
        description,
        thumbnail,
        type
      })

      // Handle word associations if provided
      if (wordIds && wordIds.length > 0) {
        // Remove existing word-topic associations
        await queryRunner.manager.delete(WordTopic, { topicId: id })

        // Create new word-topic associations
        const wordTopics = wordIds.map((wordId) => ({
          topicId: id,
          wordId: wordId
        }))

        await queryRunner.manager.getRepository(WordTopic).save(wordTopics)
      }

      // Handle course associations if provided
      // if (courseIds && courseIds.length > 0) {
      //   // For each course, find the highest existing display order
      //   const courseTopics = []

      //   for (const courseId of courseIds) {
      //     // Find the highest display order for this course
      //     const highestOrder = await queryRunner.manager
      //       .getRepository(CourseTopic)
      //       .createQueryBuilder('courseTopic')
      //       .where('courseTopic.courseId = :courseId', { courseId })
      //       .orderBy('courseTopic.displayOrder', 'DESC')
      //       .getOne()

      //     // Calculate the next display order (either increment or start at 0)
      //     const nextDisplayOrder = highestOrder ? highestOrder.displayOrder + 1 : 0

      //     // Create the new course-topic association
      //     courseTopics.push({
      //       topic: { id: id },
      //       course: { id: courseId },
      //       displayOrder: nextDisplayOrder
      //     })
      //   }

      //   await queryRunner.manager.getRepository(CourseTopic).save(courseTopics)
      // }

      // Refresh the topic to include all associations
      const updatedTopic = await queryRunner.manager.findOne(Topic, {
        where: { id },
        relations: ['wordTopics', 'wordTopics.word', 'courseTopics', 'courseTopics.course']
      })

      if (!updatedTopic) return {}

      const words = updatedTopic.wordTopics?.map((wordTopic) => wordTopic.word) || []

      const result = {
        ...updatedTopic,
        words
        // wordTopics
      }

      await queryRunner.commitTransaction()
      return result
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when updating topic: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      await queryRunner.release()
    }
  }

  deleteTopic = async ({ id }: { id: number }) => {
    await CourseTopic.getRepository().softDelete({
      topic: {
        id
      }
    })
    return await Topic.getRepository().softDelete(id)
  }

  restoreTopic = async ({ id }: { id: number }) => {
    await CourseTopic.getRepository().restore({
      topic: {
        id
      }
    })
    return await Topic.getRepository().restore(id)
  }

  isExistTopic = async (topic: { id: number; displayOrder: number }) => {
    const resTopic = await Topic.getRepository().findOne({
      where: { id: topic.id }
    })

    return resTopic
  }

  completedTopic = async ({ topic, userId }: CompleteTopicBodyReq) => {
    //save complete topic into db
    //create word progress
    //update progress for user : streak, last study date, total study day

    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()
      const topicId = topic.id as number
      // save complete topic into db
      await queryRunner.manager.getRepository(CompletedTopic).save({ user: { id: userId }, topic: { id: topicId } })

      //create or update word progress record
      const wordsInTopic = await wordService.getAllWordInTopic({ topicId })

      const wordProgress = await wordProgressService.createOrUpdateWordProgress(
        { wordProgress: wordsInTopic, userId },
        queryRunner.manager
      )

      //update user progress
      await wordProgressService.updateUserProgress({ userId, manager: queryRunner.manager })

      // commit transaction now:
      await queryRunner.commitTransaction()

      return wordProgress
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when handle topic service: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release()
    }
    //end transaction
  }

  isTopicAlreadyCompleted = async ({ topicId, userId }: { topicId: number; userId: number }) => {
    return await CompletedTopic.exists({ where: { topic: { id: topicId }, user: { id: userId } } })
  }

  getUserProgress = async ({ userId }: { userId: number }) => {
    // Get completed topics
    const completedTopics = await CompletedTopic.find({
      where: { user: { id: userId } },
      relations: ['topic']
    })

    // Get word progress summary
    const progressSummary = await wordProgressService.getSummary({ userId })

    // Get total topics
    const totalTopics = await Topic.count()

    return {
      completedTopics: completedTopics.map((ct) => ct.topic),
      completedTopicsCount: completedTopics.length,
      totalTopics,
      progressPercentage: totalTopics > 0 ? (completedTopics.length / totalTopics) * 100 : 0,
      wordProgressSummary: progressSummary
    }
  }

  getTopicWords = async ({
    topicId,
    page = 1,
    limit = 10,
    sort
  }: {
    topicId: number
    page?: number
    limit?: number
    sort?: any
  }) => {
    const skip = (page - 1) * limit

    const topicWords = await WordTopic.find({
      where: { topic: { id: topicId } },
      relations: ['word'],
      order: sort,
      skip,
      take: limit
    })

    const total = await WordTopic.count({
      where: { topic: { id: topicId } }
    })

    const words = topicWords.map((topicWord) => ({
      ...topicWord.word
    }))

    return {
      words,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const topicService = new TopicService()
