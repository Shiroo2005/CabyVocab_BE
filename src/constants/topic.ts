export enum TopicType {
  FREE = 'Free',
  PREMIUM = 'Premium'
}

export const getTopicTypeList = () => {
  return Object.values(TopicType)
}

export const DEFAULT_LIMIT_AMOUNT_POPULAR_TOPIC = 5
