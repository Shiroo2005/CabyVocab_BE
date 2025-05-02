import { validate } from 'class-validator'
import { NotFoundRequestError } from '~/core/error.response'
import { WordBody } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { wordQueryReq } from '~/dto/req/word/wordQuery.req'
import { Word } from '~/entities/word.entity'
import { WordTopic } from '~/entities/wordTopic.entity'

class WordService {
  createWords = async (words: WordBody[]) => {
    // Create words using the static createWord method which properly handles topicIds
    const _words = await Promise.all(
      words.map(async (word) => {
        return await Word.createWord({
          content: word.content,
          meaning: word.meaning,
          pronunciation: word.pronunciation,
          audio: word.audio,
          image: word.image,
          rank: word.rank,
          position: word.position,
          example: word.example,
          translateExample: word.translateExample,
          topicIds: word.topicIds
        } as Word & { topicIds?: number[] })
      })
    )
  
    return _words
  }

  updateWord = async (
    id: number,
    {
      content,
      meaning,
      pronunciation,
      audio,
      example,
      image,
      position,
      rank,
      translateExample,
      topicIds
    }: UpdateWordBodyReq
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
      rank,
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
    content,
    example,
    meaning,
    position,
    pronunciation,
    rank,
    translateExample,
    sort
  }: wordQueryReq) => {
    //build where condition
    const skip = (page - 1) * limit

    const [words, total] = await Word.findAndCount({
      skip,
      take: limit,
      where: {
        content,
        example,
        meaning,
        position,
        pronunciation,
        rank,
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
        rank: true,
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
    const result = await Word.getRepository().softDelete(id)

    return result
  }

  restoreWordById = async ({ id }: { id: number }) => {
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
