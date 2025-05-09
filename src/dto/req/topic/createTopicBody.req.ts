import { TopicType } from '~/constants/topic'
import { User } from '~/entities/user.entity'

export interface CreateTopicBodyReq {
  topics: TopicBody[]
  user?: User
}

export interface TopicBody {
  title: string
  description: string
  thumbnail?: string
  type?: TopicType
  wordIds?: number[]
  isPublic?: boolean
}
