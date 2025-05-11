import express from 'express'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'
import { Course } from '~/entities/courses.entity'
import { courseController } from '~/controllers/course.controller'
import { createCourseValidation } from '~/middlewares/course/createCourse.middlewares'
import { updateCourseValidation } from '~/middlewares/course/updateCourse.middlewares'
import { Topic } from '~/entities/topic.entity'

const courseRouter = express.Router()

// access token validation
courseRouter.use(accessTokenValidation)

//GET
/**
 * @description : get all courses
 * @method : GET
 * @path : /
 * @Query :
 * {
 *     page?: number,
 *     limit?: number,
 *     title?: string
 *     target?: string
 *     level?: CourseLevel
 *     description?: string
 *     sort?: FindOptionsOrder<Course>
 * }
 */
courseRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Course.allowSortList })),
  wrapRequestHandler(courseController.getAllCourses)
)

/**
 * @description : Get const course level
 * @method : GET
 * @path : /course-level-list
 */
courseRouter.get('/level-list', wrapRequestHandler(courseController.getCourseLevelList))

/**
 * @description : Get course by id
 * @method : GET
 * @path : /:id
 */
courseRouter.get('/:id', checkIdParamMiddleware, wrapRequestHandler(courseController.getCourseByID))

//POST
/**
 * @description : Create new courses
 * @method : POST
 * @path : /
 * @header :
 * @body : {
 *    title: string,
 *    level: CourseLevel
 *    target?: string
 *    description?: string
 *    topics?: {
 *        id: number
 *        displayOrder: number
 *    }[]
 * }[]
 */
courseRouter.post('/', createCourseValidation, wrapRequestHandler(courseController.createCourse))

//PATH
/**
 * @description : Update course
 * @method : PATCH
 * @path : /:id
 * @header : Authorization
 * @param: id
 * @body : {
 *    title?: string,
 *    level?: CourseLevel
 *    target?: string
 *    description?: string
 *    topics?: {
 *        id: number
 *        displayOrder: number
 *    }[]
 * }
 */
courseRouter.patch(
  '/:id',
  checkIdParamMiddleware,
  updateCourseValidation,
  wrapRequestHandler(courseController.updateCourse)
)

/**
 * @description : Restore course from deleted
 * @method : PATCH
 * @path : /:id/restore
 * @header : Authorization
 * @params: id
 */
courseRouter.patch('/:id/restore', checkIdParamMiddleware, wrapRequestHandler(courseController.restoreCourse))

//PUT

//DELETE
/**
 * @description : Delete course by id
 * @method : DELETE
 * @path : /:id
 * @param : id
 * @header : Authorization
 */
courseRouter.delete('/:id', checkIdParamMiddleware, wrapRequestHandler(courseController.deleteCourse))

//GET
/**
 * @description : Get course topics
 * @method : GET
 * @path : /:id/topics
 * @param : id
 * @header : Authorization
 */
courseRouter.get(
  '/:id/topics',
  checkIdParamMiddleware,
  checkQueryMiddleware(),
  wrapRequestHandler(courseController.getCourseTopics)
)

export default courseRouter
