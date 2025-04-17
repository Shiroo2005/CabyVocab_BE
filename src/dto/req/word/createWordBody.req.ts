import { WordPosition, WordRank } from '~/constants/word'

export interface CreateWordBodyReq {
  words: WordBody[]
}

export interface WordBody {
  content: string
  pronunciation: string
  meaning: string
  position?: WordPosition
  audio?: string
  image?: string
  rank?: WordRank
  example?: string
  translateExample?: string
}