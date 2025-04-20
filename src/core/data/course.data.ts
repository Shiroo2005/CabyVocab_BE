// import { Course } from '~/entities/course.entity'
// import { faker } from '@faker-js/faker'
// import { CourseLevel } from '~/constants/couse'
// import { Topic } from '~/entities/topic.entity'
// import { CourseTopic } from '~/entities/courseTopic.entity'
// import { topicSeedData } from './topic.data'

// const COURSE_COUNT = 20

// const randomCourse = (topics: Topic[]): Course => {
//   const selectedTopics = faker.helpers.arrayElements(topics, faker.number.int({ min: 1, max: 3 }))
//   const courseTopics: CourseTopic[] = selectedTopics.map((topic, index) => {
//     const ct = new CourseTopic()
//     ct.topic = topic
//     ct.displayOrder = index + 1
//     return ct
//   })

//   return {
//     title: faker.company.catchPhrase(),
//     description: faker.lorem.sentence(),
//     target: faker.person.jobTitle(),
//     level: CourseLevel.BEGINNER,
//     courseTopics
//   } as Course
// }

// export const courseSeedData = faker.helpers.multiple(() => randomCourse(topicSeedData), { count: COURSE_COUNT })
