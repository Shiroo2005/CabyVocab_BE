import { ReportType } from '~/constants/report'

export class CreateReportBodyReq {
  content: string
  type: ReportType
}
