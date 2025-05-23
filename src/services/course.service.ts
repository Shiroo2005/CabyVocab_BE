import { CourseBody } from '~/dto/req/course/createCourseBody.req'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody,req'
import { CourseTopic } from '~/entities/courseTopic.entity'
import { Course } from '~/entities/courses.entity'
import { Topic } from '~/entities/topic.entity'
import { courseQueryReq } from '~/dto/req/course/courseQueryReq.req'
import { unGetData } from '~/utils'
import { BadRequestError } from '~/core/error.response'
import { DatabaseService } from './database.service'
import { CompletedTopic } from '~/entities/completedTopic.entity'
import { In } from 'typeorm'
import { User } from '~/entities/user.entity'

class CourseService {
  createCourse = async (coursesBody: CourseBody[]) => {
    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const courses = []

      for (const courseBody of coursesBody) {
        const newCourse = Course.create({ ...courseBody })

        // Save the course first to get an ID
        const savedCourse = await queryRunner.manager.save(newCourse)

        const { topics } = courseBody

        if (topics && topics.length > 0) {
          const courseTopics = []

          for (const topic of topics) {
            const existingTopic = await Topic.findOne({
              where: { id: topic.id }
            })

            if (existingTopic) {
              const courseTopic = CourseTopic.create({
                course: savedCourse,
                topic: existingTopic,
                displayOrder: topic.displayOrder
              })

              const savedCourseTopic = await queryRunner.manager.save(courseTopic)
              courseTopics.push(savedCourseTopic)
            }
          }

          savedCourse.courseTopics = courseTopics
          savedCourse.totalTopic = courseTopics.length

          // Update the course with the total topic count
          await queryRunner.manager.save(savedCourse)
        }

        // Fetch the complete course with all relations
        const completeCourse = await queryRunner.manager.findOne(Course, {
          where: { id: savedCourse.id },
          relations: ['courseTopics', 'courseTopics.topic']
        })

        if (completeCourse) {
          // Create a clean course object without the nested redundancy
          const cleanCourse = {
            id: completeCourse.id,
            title: completeCourse.title,
            level: completeCourse.level,
            target: completeCourse.target,
            description: completeCourse.description,
            topics: completeCourse.courseTopics.map((ct) => ({
              ...ct.topic,
              displayOrder: ct.displayOrder
            })),
            createdAt: completeCourse.createdAt,
            updatedAt: completeCourse.updatedAt
          }

          courses.push(cleanCourse)
        }
      }

      await queryRunner.commitTransaction()
      return courses
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when creating courses: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      await queryRunner.release()
    }
  }

  getCourseById = async ({ id }: { id: number }) => {
    const res = await Course.findOne({
      where: { id },
      relations: ['courseTopics', 'courseTopics.topic'],
      select: {
        id: true,
        title: true,
        level: true,
        target: true,
        description: true,
        courseTopics: true
      }
    })

    if (!res) return {}

    const topics = res.courseTopics.map((item) => {
      return {
        ...item.topic,
        displayOrder: item.displayOrder
      }
    })

    const course = unGetData({
      fields: ['courseTopics'],
      object: res
    })

    return {
      ...course,
      topics
    }
  }

  getAllCourse = async (
    user: User,
    { page = 1, limit = 10, title, target, level, description, sort }: courseQueryReq
  ) => {
    const skip = (page - 1) * limit

    const [courses, total] = await Course.findAndCount({
      skip,
      take: limit,
      relations: ['courseTopics', 'courseTopics.topic'],
      where: {
        title,
        target,
        level,
        description
      },
      order: sort,
      select: {
        id: true,
        title: true,
        target: true,
        level: true,
        description: true,
        courseTopics: {
          id: true,
          topic: {
            id: true
          }
        }
      }
    })

    return {
      courses: await Promise.all(
        courses.map(async (course) => {
          return {
            ...course,
            alreadyLearned: await this.alreadyLearnCourse(user.id as number, course)
          }
        })
      ),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  updateCourse = async (id: number, { title, description, level, target, topics }: UpdateCourseBodyReq) => {
    const databaseService = DatabaseService.getInstance()
    const queryRunner = databaseService.appDataSource.createQueryRunner()

    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      // First update the basic course properties
      await queryRunner.manager.update(Course, id, {
        title,
        description,
        level,
        target
      })

      // Handle topic associations if provided
      if (topics && topics.length > 0) {
        // Remove existing course-topic associations
        await queryRunner.manager.delete(CourseTopic, { course: { id } })

        // Create new course-topic associations with the provided display orders
        const courseTopics = []

        for (const topic of topics) {
          courseTopics.push({
            course: { id },
            topic: { id: topic.id },
            displayOrder: topic.displayOrder
          })
        }

        await queryRunner.manager.getRepository(CourseTopic).save(courseTopics)
      }

      // Fetch the updated course with a cleaner structure
      const updatedCourse = await queryRunner.manager.findOne(Course, {
        where: { id },
        relations: ['courseTopics', 'courseTopics.topic']
      })

      if (!updatedCourse) return {}

      // Create a clean course object without the nested redundancy
      const result = {
        id: updatedCourse.id,
        title: updatedCourse.title,
        level: updatedCourse.level,
        target: updatedCourse.target,
        description: updatedCourse.description,
        topics: updatedCourse.courseTopics.map((ct) => ({
          ...ct.topic,
          displayOrder: ct.displayOrder
        })),
        createdAt: updatedCourse.createdAt,
        updatedAt: updatedCourse.updatedAt
      }

      await queryRunner.commitTransaction()
      return result
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction()
      }
      console.log(`Error when updating course: ${err}`)
      throw new BadRequestError({ message: `${err}` })
    } finally {
      await queryRunner.release()
    }
  }

  restoreCourse = async ({ id }: { id: number }) => {
    const res = Course.getRepository().restore(id)

    return res || {}
  }

  deleteCourse = async ({ id }: { id: number }) => {
    const res = Course.getRepository().softDelete(id)

    return res
  }

  getCourseTopics = async (
    user: User,
    {
      courseId,
      page = 1,
      limit = 10,
      sort
    }: {
      courseId: number
      page?: number
      limit?: number
      sort?: any
    }
  ) => {
    const skip = (page - 1) * limit

    // Find all course-topic relationships for this course
    const courseTopics = await CourseTopic.find({
      where: { course: { id: courseId } },
      relations: ['topic'],
      order: { displayOrder: 'ASC', ...sort },
      skip,
      take: limit
    })

    // Count total topics for this course
    const total = await CourseTopic.count({
      where: { course: { id: courseId } }
    })

    const topicIds = courseTopics.map((item) => item.topic?.id as number)

    //find topic complete by user
    const completeTopics = await CompletedTopic.find({
      where: {
        topic: {
          id: In(topicIds)
        },
        user: {
          id: user.id
        }
      },
      relations: ['topic']
    })

    // Map the results to return topic data with display order
    const topics = courseTopics.map((courseTopic) => {
      const alreadyLearned =
        completeTopics.filter((completeTopic) => completeTopic.topic.id == (courseTopic.topic as Topic).id).length > 0

      return {
        ...courseTopic.topic,
        displayOrder: courseTopic.displayOrder,
        alreadyLearned
      }
    })

    return {
      topics,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  alreadyLearnCourse = async (userId: number, course: Course) => {
    //find complete topic in course with user
    const completeTopics = CompletedTopic.find({
      where: {
        topic: {
          id: In(course.courseTopics.map((item) => item.topic?.id))
        },
        user: {
          id: userId
        }
      }
    })

    return (await completeTopics).length === course.courseTopics.length
  }
}

export const courseService = new CourseService()
