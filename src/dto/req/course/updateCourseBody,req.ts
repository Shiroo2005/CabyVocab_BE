import { CourseLevel } from "~/constants/course";

export interface UpdateCourseBodyReq {
  title?: string,
  level?: CourseLevel
  target?: string
  description?: string
  topics?: {
    id: number
    displayOrder: number
  }[]
}