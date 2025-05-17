import { Topic } from '~/entities/topic.entity'
import { faker } from '@faker-js/faker'
import { TopicType } from '~/constants/topic'
import { Word } from '~/entities/word.entity'
import { WordTopic } from '~/entities/wordTopic.entity'
import { CreateTopicBodyReq, TopicBody } from '~/dto/req/topic/createTopicBody.req'
import { topicService } from '~/services/topic.service'

const TOPIC_COUNT = 100

const randomTopic = (words: Word[]): Topic => {
  console.log(
    faker.helpers.arrayElements(words, faker.number.int({ min: 2, max: 20 })).map((item) => {
      return {
        word: item
      } as WordTopic
    })
  )

  const topics = {
    title: faker.word.words(2),
    description: faker.lorem.sentence(),
    thumbnail: faker.image.avatar(),
    type: TopicType.FREE,
    wordTopics: faker.helpers.arrayElements(words, faker.number.int({ min: 2, max: 20 })).map((word) => {
      return {
        wordId: word.id,
        word
      } as WordTopic
    })
  } as Topic

  return topics
}

export const topicSeedData = (word: Word[]) => {
  return faker.helpers.multiple(() => randomTopic(word), { count: TOPIC_COUNT })
}
