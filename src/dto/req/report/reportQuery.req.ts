import { FindOptionsOrder } from 'typeorm'
import { ReportStatus, ReportType } from '~/constants/report'
import { Report } from '~/entities/report.entity'

export class ReportQueryReq {
  page?: number
  limit?: number
  status?: ReportStatus
  sort?: FindOptionsOrder<Report>
  type?: ReportType
}
