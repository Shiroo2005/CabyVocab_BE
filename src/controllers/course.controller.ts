import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { CREATED } from '~/core/success.response'
import { CreateCoursesReqBody } from '~/dto/req/course/createCourseBody.req'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody,req'
import { courseService } from '~/services/course.service'



class CourseController {
  createCourse = async(req: Request<ParamsDictionary, any, CreateCoursesReqBody>, res: Response) => {
    new CREATED({
      message: 'Create courses success',
      metaData: await courseService.createCourse(req.body.courses)
    }).send(res);
  }

  updateCourse = async(req: Request<ParamsDictionary, any, UpdateCourseBodyReq>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Update course success',
      metaData: await courseService.updateCourse(id, req.body)
    }).send(res);
  }

  getAllCourses = async(req: Request<ParamsDictionary, any, any>, res: Response) => {
    new CREATED({
      message: 'Get all courses success',
      metaData: await courseService.getAllCourse({
        ...req.query,
        ...req.parseQueryPagination,
        sort: req.sortParsed
      })
    }).send(res);
  }

  getCourseByID = async(req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Get course by ID success',
      metaData: await courseService.getCourseById({ id })
    }).send(res);
  }

  restoreCourse = async(req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Restore course success',
      metaData: await courseService.restoreCourse({ id })
    }).send(res);
  }

  deleteCourse = async(req: Request<ParamsDictionary, any, any>, res: Response) => {
    const id = parseInt(req.params?.id)

    new CREATED({
      message: 'Restore course success',
      metaData: await courseService.deleteCourse({ id })
    }).send(res);
  }

}

export const courseController = new CourseController