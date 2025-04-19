import { validate } from 'class-validator'
import { WordBody } from '~/dto/req/word/createWordBody.req'
import { UpdateWordBodyReq } from '~/dto/req/word/updateWordBody.req'
import { wordQueryReq } from '~/dto/req/word/wordQuery.req'
import { Word } from '~/entities/word.entity'

class WordService {
  createWords = async (words: WordBody[]) => {
    // create object word
    const _words = words.map((word) => Word.create({ ...word }))

    //validate before save
    await validate(_words)

    //save in db
    const result = await Word.save(_words)

    return result
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

    if (word)
      Word.updateWord(word, {
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

    return word || {}
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
}

export const wordService = new WordService()
