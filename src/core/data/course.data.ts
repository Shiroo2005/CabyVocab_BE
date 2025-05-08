import { faker } from '@faker-js/faker'
import { Topic } from '~/entities/topic.entity'
import { topicSeedData } from './topic.data'
import { CourseTopic } from '~/entities/course_topic.entity'
import { CourseLevel } from '~/constants/course'
import { Course } from '~/entities/courses.entity'

const COURSE_COUNT = 20

const randomCourse = (topics: Topic[]): Course => {
  const selectedTopics = faker.helpers.arrayElements(topics, faker.number.int({ min: 1, max: 3 }))
  const courseTopics: CourseTopic[] = selectedTopics.map((topic, index) => {
    const ct = new CourseTopic()
    ct.topic = topic
    ct.displayOrder = index + 1
    return ct
  })

  return {
    title: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    target: faker.person.jobTitle(),
    level: CourseLevel.BEGINNER,
    courseTopics
  } as Course
}

export const courseSeedData = (topics: Topic[]) => {
  return faker.helpers.multiple(() => randomCourse(topics))
}
