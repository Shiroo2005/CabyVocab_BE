import { FindOptionsOrder } from "typeorm"
import { CourseLevel } from "~/constants/course"
import { Course } from "~/entities/courses.entity"

export interface courseQueryReq {
  page?: number
  limit?: number
  title?: string,
  level?: CourseLevel
  target?: string
  description?: string
  sort?: FindOptionsOrder<Course>
}
