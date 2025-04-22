import { relative } from "path";
import { CourseBody } from "~/dto/req/course/createCourseBody.req"
import { Course } from "~/entities/courses.entity"


class CourseService {
  createCourses = async (courses: CourseBody[]) => {
    const _courses = await Promise.all(
      courses.map(async course =>{
        const newCourse = Course.create({...course})
        return newCourse;
      }
    ));

    const res = await Course.save(_courses)

    return res;
  }

  getCourseById = async({id}: {id: number}) => {
    const res = await Course.findOne({
      where: {id},
      relations: ['courseTopics']
    })

    return res || {}
  }

  getAllCourse = async() => {

  }

  updateCourse = async() => {

  }

  restoreCourse = async() => {

  }

  deleteCourse = async() => {

  }

}

export const courseService = new CourseService;