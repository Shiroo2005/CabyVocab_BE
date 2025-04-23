import { TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { topicQueryReq } from '~/dto/req/topic/topicQuery.req'
import { UpdateTopicBodyReq } from '~/dto/req/topic/updateTopicBody.req'
import { Topic } from '~/entities/topic.entity'
import { Word } from '~/entities/word.entity'
import { wordService } from './word.service'
import { validate } from 'class-validator'
import { In } from 'typeorm'

class TopicService {
  createTopics = async (topicsBody: TopicBody[]) => {
    const topics = [] as Topic[]

    await Promise.all(
      topicsBody.map(async (topic) => {
        const { wordIds } = topic
        const words = [] as Word[]

        if (wordIds && wordIds.length > 0) {
          //filter word id valid
          for (const id of wordIds) {
            const foundWord = await wordService.getWordById({ id })
            if (foundWord && Object.keys(foundWord).length != 0) {
              words.push({ id } as Word)
            }
          }
        }
        const newTopic = Topic.create({ ...topic, words })
        topics.push(newTopic)
      })
    )

    //validate before save into db
    await validate(topics)

    //save itopics nto db
    const res = await Topic.save(topics)

    return res
  }

  getTopicById = async ({ id }: { id: number }) => {
    const res = await Topic.findOne({
      where: {
        id
      }
    })

    return res || {}
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
    });

    return resTopic;
  }

}

export const topicService = new TopicService()
