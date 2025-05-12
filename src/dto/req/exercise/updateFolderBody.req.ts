import { flashCardBody } from './flashcard/createdFlashCardBody.req'
import { quizBodyData } from './quiz/createQuizBody.req'

export class updateFolderBodyReq {
  name?: string
  quizzes?: quizBodyData[]
  flashCards?: flashCardBody[]
}
