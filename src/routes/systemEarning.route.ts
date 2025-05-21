import express from 'express'
import { systemEarningController } from '~/controllers/systemEarning.controller'
import { SystemEarning } from '~/entities/systemEarning.entity'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

export const systemEarningRouter = express.Router()

systemEarningRouter.use(accessTokenValidation)

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
systemEarningRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: SystemEarning.allowSortList })),
  wrapRequestHandler(systemEarningController.getSystemEarning)
)
