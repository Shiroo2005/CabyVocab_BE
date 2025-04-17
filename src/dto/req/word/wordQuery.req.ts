import { FindOptionsOrder } from 'typeorm'
import { WordPosition, WordRank } from '~/constants/word'
import { Word } from '~/entities/word.entity'

export interface wordQueryReq {
  page: number
  limit: number
  content?: string
  pronunciation?: string
  meaning?: string
  position?: WordPosition
  rank?: WordRank
  example?: string
  translateExample?: string
  sort?: FindOptionsOrder<Word>
}