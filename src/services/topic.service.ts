import { BadRequestError } from "~/core/error.response"
import { CreateTopicBodyReq, TopicBody } from "~/dto/req/Topic/createTopicBody.req"
import { topicQueryReq } from "~/dto/req/Topic/topicQuery.req"
import { UpdateTopicBodyReq } from "~/dto/req/Topic/updateTopicBody.req"
import { CourseTopic } from "~/entities/course_topic.entity"
import { Topic } from "~/entities/topic.entity"
import { Word } from "~/entities/word.entity"

class TopicService {
  createTopics = async (topics: TopicBody[]) => {
    if(!topics || !Array.isArray(topics))
      throw new BadRequestError({message: 'invalid topics form'})

    const _topics = topics.map(topic => Topic.create({...topic}))

    const res = await Topic.save(_topics);

    return res;
  }

  getTopicById = async ({id}: { id: number }) => {
    const res = await Topic.findOne({
      where: {
        id,
      }
    })

    return res || {}
  }

  getAllTopics = async ({
    page = 1,
    limit = 10,
    title,
    description,
    type,
    sort
  }: topicQueryReq) => {
    const skip = (page - 1) * limit

    const [topics, total] = await Topic.findAndCount({
      skip,
      take: limit,
      where:{
        title,
        description,
        type
      },
      order: sort,
      select:{
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

  updateTopic = async (id: number, {title, description, thumbnail, type}: UpdateTopicBodyReq) => {
    const updateTopic = await Topic.update(id, {
      title,
      description,
      thumbnail,
      type
    })

    return updateTopic || {}
  }

  //middleware ktr relations
  deleteTopic = async ({id}: {id: number}) => {
    return await Topic.getRepository().softDelete(id)
  }

  restoreTopic = async ({id}: {id: number}) => {
    return await Topic.getRepository().restore(id);
  }
}

export const topicService = new TopicService()