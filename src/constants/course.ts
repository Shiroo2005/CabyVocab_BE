export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCE = 'Advance'
}

export const getCourseLevel = () => {
  return Object.values(CourseLevel)
}

export const DEFAULT_LIMIT_AMOUNT_POPULAR_COURSE = 5
