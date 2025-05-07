export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCE = 'Advance'
}

export const getCourseLevel = () => {
  return Object.values(CourseLevel)
}
