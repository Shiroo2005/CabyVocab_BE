import { Word } from '~/entities/word.entity'

export interface CreateWordProgressBodyReq {
  wordProgress: Word[]
  userId: number
}
