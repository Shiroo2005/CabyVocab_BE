import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { getCourseLevel } from '~/constants/course'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateCoursesReqBody } from '~/dto/req/course/createCourseBody.req'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody,req'
import { User } from '~/entities/user.entity'
import { courseService } from '~/services/course.service'

class CourseController {
  createCourse = async (req: Request<ParamsDictionary, any, CreateCoursesReqBody>, res: Response) => {
    new CREATED({
      message: 'Create courses success',
      metaData: await courseService.createCourse(req.body.courses)
    }).send(res)
  }

  updateCourse = async (req: Request<ParamsDictionary, any, UpdateCourseBodyReq>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Update course success',
      metaData: await courseService.updateCourse(id, req.body)
    }).send(res)
  }

  getAllCourses = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const user = req.user as User

    new CREATED({
      message: 'Get all courses success',
      metaData: await courseService.getAllCourse(user, {
        ...req.query,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res)
  }

  getCourseByID = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Get course by ID success',
      metaData: await courseService.getCourseById({ id })
    }).send(res)
  }

  getCourseLevelList = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const data = getCourseLevel()

    new SuccessResponse({
      message: 'Get course level success!',
      metaData: {
        data
      }
    }).send(res)
  }

  restoreCourse = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Restore course success',
      metaData: await courseService.restoreCourse({ id })
    }).send(res)
  }

  deleteCourse = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Delete course success',
      metaData: await courseService.deleteCourse({ id })
    }).send(res)
  }
  getCourseTopics = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const courseId = parseInt(req.params?.id)
    const user = req.user as User
    new SuccessResponse({
      message: 'Get course topics successful!',
      metaData: await courseService.getCourseTopics(user, {
        courseId,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res)
  }
}

export const courseController = new CourseController()
