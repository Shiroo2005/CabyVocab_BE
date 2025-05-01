import { WordProgress } from "~/entities/word_progress.entity"

export interface UpdateWordProgressBodyReq {
  wordProgress: UpdateWordProgressData[]
}

export interface UpdateWordProgressData {
  wrongCount?: number
  word: WordProgress
  reviewedDate: Date
}
