import { TopicType } from "~/constants/topic";
import { Topic } from "~/entities/topic.entity";

export interface UpdateTopicBodyReq {
  title: string,
  description: string,
  thumbnail?: string,
  type?: TopicType
}
