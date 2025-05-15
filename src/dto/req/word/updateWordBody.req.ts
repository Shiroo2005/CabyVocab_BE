import { WordPosition } from '~/constants/word'

export interface UpdateWordBodyReq {
  content?: string
  pronunciation?: string
  meaning?: string
  position?: WordPosition
  audio?: string
  image?: string
  example?: string
  translateExample?: string
  topicIds: number[]
}
