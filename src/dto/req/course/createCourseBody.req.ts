import { WordRank } from "~/constants/word";

export interface CreateCoursesReqBody {
  courses: CourseBody[]
}

export interface CourseBody{
  title: string,
  level: WordRank
  target: string
  description?: string
}