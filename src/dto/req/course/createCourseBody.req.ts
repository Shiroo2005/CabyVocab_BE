import { CourseLevel } from "~/constants/course";

export interface CreateCoursesReqBody {
  courses: CourseBody[]
}

export interface CourseBody{
  title: string,
  level: CourseLevel
  target?: string
  description?: string
  topics?: {
    id: number
    displayOrder: number
  }[]
}