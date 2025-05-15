import { FindOptionsOrder } from 'typeorm'
import { WordPosition } from '~/constants/word'
import { Word } from '~/entities/word.entity'

export interface wordQueryReq {
  page?: number
  limit?: number
  content?: string
  pronunciation?: string
  meaning?: string
  position?: WordPosition
  example?: string
  translateExample?: string
  sort?: FindOptionsOrder<Word>
}
