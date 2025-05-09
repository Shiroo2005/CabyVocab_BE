import { TopicType } from '~/constants/topic'

export interface UpdateTopicBodyReq {
  title: string
  description: string
  thumbnail?: string
  type?: TopicType
  wordIds: number[]
  isPublic?: boolean
}
