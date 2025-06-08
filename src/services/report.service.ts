import { ReportStatus, ReportType } from '~/constants/report'
import { BadRequestError } from '~/core/error.response'
import { CreateReportBodyReq } from '~/dto/req/report/createReportBody.req'
import { ReportQueryReq } from '~/dto/req/report/reportQuery.req'
import { Report } from '~/entities/report.entity'
import { User } from '~/entities/user.entity'

class ReportService {
  createReport = async (userId: number, { content, type }: CreateReportBodyReq) => {
    const newReport = Report.create({
      content,
      type,
      createdBy: {
        id: userId
      } as User,
      status: ReportStatus.PENDING
    })

    return await newReport.save()
  }

  updateReport = async (reportId: number, status: ReportStatus) => {
    const foundReport = await Report.findOneBy({
      id: reportId
    })

    if (!foundReport) throw new BadRequestError({ message: 'Report not found' })

    foundReport.status = status
    return await foundReport.save()
  }

  getAllReport = async ({ page = 1, limit = 10, sort }: ReportQueryReq) => {
    const skip = (page - 1) * limit
    const [reports, total] = await Report.findAndCount({
      skip,
      take: limit,
      order: sort
    })
    return {
      reports,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export const reportService = new ReportService()
