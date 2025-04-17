import { FindOptionsOrder } from "typeorm"
import { TopicType } from "~/constants/topic"
import { Topic } from "~/entities/topic.entity"

export interface topicQueryReq {
  page: number,
  limit: number,
  title?: string
  description?: string,
  type?: TopicType
  sort?: FindOptionsOrder<Topic>
}