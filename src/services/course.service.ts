import { relative } from "path";
import { UpdateContactOptions } from "resend";
import { CourseBody } from "~/dto/req/course/createCourseBody.req"
import { UpdateCourseBodyReq } from "~/dto/req/course/updateCourseBody,req";
import { CourseTopic } from "~/entities/course_topic.entity";
import { Course } from "~/entities/courses.entity"
import { topicService } from "./topic.service";
import { Topic } from "~/entities/topic.entity";
import { courseQueryReq } from "~/dto/req/course/courseQueryReq.req";


class CourseService {
  createCourse = async (coursesBody: CourseBody[]) => {
    const courses = await Promise.all(
      coursesBody.map(async (courseBody) => {
        const newCourse = Course.create({ ...courseBody })

        const { topics } = courseBody

        if (topics && topics.length > 0) {
          
          const validTopics: CourseTopic[] = []
          
          for (const topic of topics) {
            const existingTopic = await topicService.isExistTopic(topic);
  
            if (existingTopic) {
              const courseTopic = CourseTopic.create({
                course: newCourse,
                topic: existingTopic,
                displayOrder: topic.displayOrder,
              });

              await courseTopic.save();

              validTopics.push(courseTopic);
            }
          }

          newCourse.courseTopics = validTopics
        }

        return newCourse
      })
    )

    //save topic into db
    const createdCourses = await Course.getRepository().save(courses)

    return createdCourses
  }


  getCourseById = async({id}: {id: number}) => {
    const res = await Course.findOne({
      where: {id},
      relations: ['courseTopics'],
      select: {
        id: true,
        title: true,
        level: true,
        target: true,
        description: true,
        courseTopics: true
      }
    })

    return res || {}
  }

  getAllCourse = async ({
    page = 1,
    limit = 10,
    title,
    target,
    level,
    description,
    sort
  } : courseQueryReq ) => {
    const skip = (page - 1) * limit
    
    const [courses, total] = await Course.findAndCount({
      skip,
      take: limit,
      relations: ['courseTopics'],
      where: {
        title,
        target,
        level,
        description,
      },
      order: sort,
      select: {
        id: true,
        title: true,
        target: true,
        level: true,
        description: true,
        courseTopics: true,
      }
    })

    return {
      courses,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  updateCourse = async(
    id: number, course : UpdateCourseBodyReq
  ) => {
    const updateCourse = await Course.getRepository().findOne({ where: { id: id } })

    if(updateCourse)
    {
      const resCourse = Course.updateCourse(updateCourse, course)
      return resCourse || {}
    }
  }

  restoreCourse = async({id}: {id: number}) => {
    const res = Course.getRepository().restore(id)

    return res || {};
  }

  deleteCourse = async({id}: {id: number}) => {
    const res = Course.getRepository().softDelete(id)

    return res
  }

}

export const courseService = new CourseService;