import { validate } from 'class-validator'
import { BadRequestError, NotFoundRequestError } from '~/core/error.response'
import { WordBody } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { wordQueryReq } from '~/dto/req/word/wordQuery.req'
import { Word } from '~/entities/word.entity'
import { WordTopic } from '~/entities/wordTopic.entity'
import { DatabaseService } from './database.service'
import { Topic } from '~/entities/topic.entity'
import { In, Like } from 'typeorm'

class WordService {
  createWords = async (words: WordBody[]) => {
    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const createdWords = []

      for (const word of words) {
        // Create the word
        const newWord = Word.create({
          content: word.content,
          meaning: word.meaning,
          pronunciation: word.pronunciation,
          audio: word.audio,
          image: word.image,
          position: word.position,
          example: word.example,
          translateExample: word.translateExample
        })

        // Save the word
        const savedWord = await queryRunner.manager.save(newWord)

        // Create word-topic associations if needed
        if (word.topicIds && word.topicIds.length > 0) {
          const wordTopics = word.topicIds.map((topicId) => ({
            wordId: savedWord.id,
            topicId: topicId
          }))

          await queryRunner.manager.getRepository(WordTopic).save(wordTopics)
        }

        createdWords.push(savedWord)
      }

      await queryRunner.commitTransaction()
      return createdWords
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when creating words: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      await queryRunner.release()
    }
  }

  updateWord = async (
    id: number,
    { content, meaning, pronunciation, audio, example, image, position, translateExample, topicIds }: UpdateWordBodyReq
  ) => {
    const word = await Word.findOne({
      where: { id }
    })

    if (!word) {
      throw new NotFoundRequestError('Word not found with the provided ID')
    }

    return Word.updateWord(word, {
      content,
      meaning,
      pronunciation,
      audio,
      example,
      image,
      position,
      translateExample,
      topicIds
    })
  }

  getWordById = async ({ id }: { id: number }) => {
    const foundWord = await Word.findOne({
      where: {
        id
      }
    })

    return foundWord || {}
  }

  getAllWords = async ({
    page = 1,
    limit = 10,
    content = '',
    example,
    meaning,
    position,
    pronunciation,
    translateExample,
    sort
  }: wordQueryReq) => {
    //build where condition
    const skip = (page - 1) * limit

    const [words, total] = await Word.findAndCount({
      skip,
      take: limit,
      where: {
        content: Like(`%${content}%`),
        example,
        meaning,
        position,
        pronunciation,
        translateExample
      },
      order: sort,
      select: {
        id: true,
        audio: true,
        content: true,
        example: true,
        image: true,
        meaning: true,
        position: true,
        pronunciation: true,
        translateExample: true
      }
    })

    return {
      words,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  deleteWordById = async ({ id }: { id: number }) => {
    //soft delete
    await WordTopic.getRepository().softDelete({
      wordId: id
    })
    const result = await Word.getRepository().softDelete(id)

    return result
  }

  restoreWordById = async ({ id }: { id: number }) => {
    await WordTopic.getRepository().restore({
      wordId: id
    })
    const restoreWord = await Word.getRepository().restore(id)

    return restoreWord
  }

  getAllWordInTopic = async ({ topicId }: { topicId: number }) => {
    const wordTopics = await WordTopic.find({
      where: {
        topic: {
          id: topicId
        }
      },
      relations: ['word']
    })

    if (wordTopics.length == 0) return []

    return wordTopics.map((item) => item.word as Word)
  }
}

export const wordService = new WordService()
