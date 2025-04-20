import { Topic } from '~/entities/topic.entity'
import { faker } from '@faker-js/faker'
import { TopicType } from '~/constants/topic'
import { Word } from '~/entities/word.entity'

const TOPIC_COUNT = 400

const randomTopic = (words: Word[]): Topic => {
  return {
    title: faker.word.words(2),
    description: faker.lorem.sentence(),
    thumbnail: faker.image.avatar(),
    type: TopicType.FREE,
    words: faker.helpers.arrayElements(words, faker.number.int({ min: 2, max: 4 }))
  } as Topic
}

export const topicSeedData = (word: Word[]) => {
  return faker.helpers.multiple(() => randomTopic(word), { count: TOPIC_COUNT })
}
