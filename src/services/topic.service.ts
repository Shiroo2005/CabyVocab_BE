import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { topicQueryReq } from '~/dto/req/topic/topicQuery.req'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { Word } from '~/entities/word.entity'
import { wordService } from './word.service'
import { validate } from 'class-validator'
import { In } from 'typeorm'
import { CompletedTopic } from '~/entities/completed_topic.entity'
import { BadRequestError } from '~/core/error.response'
import { CompleteTopicBodyReq } from '~/dto/req/topic/completeTopicBody.req'
import { DatabaseService } from './database.service'
import { wordProgressService } from './wordProgress.service'
import { WordTopic } from '~/entities/wordTopic.entity'

class TopicService {
  createTopics = async (topicsBody: TopicBody[]) => {
    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    await queryRunner.startTransaction()
    try {
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
      
      // Handle word associations if needed
      for (let i = 0; i < savedTopics.length; i++) {
        const topic = savedTopics[i]
        const wordIds = topicsBody[i].wordIds
        
        if (wordIds && wordIds.length > 0) {
          // Create word-topic associations in bulk
          const wordTopics = wordIds.map(wordId => ({
            topicId: topic.id,
            wordId: wordId
          }))
          
          await queryRunner.manager.getRepository(WordTopic).save(wordTopics)
        }
      }
      
      await queryRunner.commitTransaction()
      return savedTopics
    } catch (err) {
      await queryRunner.rollbackTransaction()
      console.log(`Error when creating topics: ${err}`)
      throw new BadRequestError({message: `${err}`})
    } finally {
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

    const words = res.wordTopics?.map(wordTopic => wordTopic.word) || []
    
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

  updateTopic = async (id: number, { title, description, thumbnail, type }: UpdateTopicBodyReq) => {
    const updateTopic = await Topic.update(id, {
      title,
      description,
      thumbnail,
      type
    })

    return updateTopic || {}
  }

  deleteTopic = async ({ id }: { id: number }) => {
    return await Topic.getRepository().softDelete(id)
  }

  restoreTopic = async ({ id }: { id: number }) => {
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

    await queryRunner.startTransaction()
    //start transaction
    try {
      const topicId = topic.id as number
      // save complete topic into db
      await queryRunner.manager
        .getRepository(CompletedTopic)
        .save({ user: { id: userId }, topic: { id: topicId }})

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
      await queryRunner.rollbackTransaction()
      console.log(`Error when handle topic service: ${err}`)
      throw new BadRequestError({message: `${err}`})
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
      completedTopics: completedTopics.map(ct => ct.topic),
      completedTopicsCount: completedTopics.length,
      totalTopics,
      progressPercentage: totalTopics > 0 ? (completedTopics.length / totalTopics) * 100 : 0,
      wordProgressSummary: progressSummary
    }
  }
}

export const topicService = new TopicService()
