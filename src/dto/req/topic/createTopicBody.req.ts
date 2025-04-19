import { TopicType } from '~/constants/topic'

export interface CreateTopicBodyReq {
  topics: TopicBody[]
}

export interface TopicBody {
  title: string
  description: string
  thumbnail?: string
  type?: TopicType
  wordIds: number[]
}
