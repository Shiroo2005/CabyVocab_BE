import express from 'express'
import { Resource } from '~/constants/access'
import { systemEarningController } from '~/controllers/systemEarning.controller'
import { SystemEarning } from '~/entities/systemEarning.entity'
import { accessTokenValidation, checkPermission } from '~/middlewares/auth.middlewares'
import { checkQueryMiddleware, parseSort } from '~/middlewares/common.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

export const systemEarningRouter = express.Router()

systemEarningRouter.use(accessTokenValidation)

//GET
/**
 * @description : get all system earnings
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
  wrapRequestHandler(checkPermission('readAny', Resource.SYSTEM_EARNING)),
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: SystemEarning.allowSortList })),
  wrapRequestHandler(systemEarningController.getSystemEarning)
)

/**Get system earning summary */
systemEarningRouter.get(
  '/summary',
  wrapRequestHandler(checkPermission('readAny', Resource.SYSTEM_EARNING)),
  wrapRequestHandler(systemEarningController.getSystemEarningStatistics)
)
