import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { ReportStatus } from '~/constants/report'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateReportBodyReq } from '~/dto/req/report/createReportBody.req'
import { User } from '~/entities/user.entity'
import { reportService } from '~/services/report.service'

class ReportController {
  create = async (req: Request<ParamsDictionary, any, CreateReportBodyReq>, res: Response, next: NextFunction) => {
    const user = req.user as User

    const result = await reportService.createReport(user.id as number, req.body)
    return new CREATED({
      message: 'Create new report successful',
      metaData: result
    }).send(res)
  }

  update = async (req: Request<ParamsDictionary, any, { status: ReportStatus }>, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)

    const result = await reportService.updateReport(id, req.body.status)
    return new SuccessResponse({
      message: 'Update report by id successful',
      metaData: result
    }).send(res)
  }

  getAll = async (req: Request<ParamsDictionary, any, any>, res: Response, next: NextFunction) => {
    const result = await reportService.getAllReport({ ...req.query, ...req.parseQueryPagination, sort: req.sortParsed })
    return new SuccessResponse({
      message: 'Get all report successful',
      metaData: result
    }).send(res)
  }
}

export const reportController = new ReportController()
