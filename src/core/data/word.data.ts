import { Word } from '~/entities/word.entity'
import { faker } from '@faker-js/faker'
import { WordPosition } from '~/constants/word'

const WORD_COUNT = 1000

const randomWord = (): Word => {
  return {
    content: faker.word.words(1),
    pronunciation: `/${faker.word.sample()}/`,
    meaning: faker.lorem.words(2),
    position: WordPosition.NOUN,
    example: faker.lorem.sentence(),
    translateExample: faker.lorem.words(5),
    audio: faker.internet.url(),
    image: faker.image.url()
  } as Word
}

export const wordSeedData = faker.helpers.multiple(randomWord, { count: WORD_COUNT })
