export enum TopicType {
  FREE = 'Free',
  PREMIUM = 'Premium'
}

export const getTopicTypeList = () => {
  return Object.values(TopicType)
}
