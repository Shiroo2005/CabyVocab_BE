import { WordPosition } from '~/constants/word'

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
  example?: string
  translateExample?: string
  topicIds: number[]
}
