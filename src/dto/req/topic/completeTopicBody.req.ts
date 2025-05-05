import { Topic } from '~/entities/topic.entity'

export interface CompleteTopicBodyReq {
  userId: number
  topic: Topic
}
