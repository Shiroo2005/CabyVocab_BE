import express from 'express'
import { reportController } from '~/controllers/report.controller'
import { Report } from '~/entities/report.entity'
import { accessTokenValidation } from '~/middlewares/auth.middlewares'
import { checkIdParamMiddleware, parseSort, requireJsonContent } from '~/middlewares/common.middlewares'
import { validateCreateReport } from '~/middlewares/report/createReport.middlewares'
import { validateUpdateReport } from '~/middlewares/report/updateReport.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

export const reportRouter = express.Router()

reportRouter.use(accessTokenValidation)

//GET
reportRouter.get(
  '',
  wrapRequestHandler(parseSort({ allowSortList: Report.allowSortList })),
  wrapRequestHandler(reportController.getAll)
)

//POST
reportRouter.post(
  '',
  wrapRequestHandler(requireJsonContent),
  validateCreateReport,
  wrapRequestHandler(reportController.create)
)

//PUT
reportRouter.put(
  '/:id',
  wrapRequestHandler(checkIdParamMiddleware),
  wrapRequestHandler(requireJsonContent),
  wrapRequestHandler(validateUpdateReport),
  wrapRequestHandler(reportController.update)
)
