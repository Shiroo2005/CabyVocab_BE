import { WordPosition, WordRank } from '~/constants/word'

export interface UpdateWordBodyReq {
  content?: string
  pronunciation?: string
  meaning?: string
  position?: WordPosition
  audio?: string
  image?: string
  rank?: WordRank
  example?: string
  translateExample?: string
  topicIds: number[]
}