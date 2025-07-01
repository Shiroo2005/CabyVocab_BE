import { FindOptionsWhere } from 'typeorm'
import { ReportStatus, ReportType } from '~/constants/report'
import { BadRequestError } from '~/core/error.response'
import { CreateReportBodyReq } from '~/dto/req/report/createReportBody.req'
import { ReportQueryReq } from '~/dto/req/report/reportQuery.req'
import { Report } from '~/entities/report.entity'
import { User } from '~/entities/user.entity'
import { isValidEnumValue } from '~/utils'

class ReportService {
  createReport = async (userId: number, { content, type, targetId }: CreateReportBodyReq) => {
    const newReport = Report.create({
      content,
      type,
      createdBy: {
        id: userId
      } as User,
      status: ReportStatus.PENDING,
      targetId
    })

    return await newReport.save()
  }

  updateReport = async (reportId: number, status: ReportStatus) => {
    const foundReport = await Report.findOne({
      where: {
        id: reportId
      },
      relations: ['createdBy'],
      select: {
        id: true,
        content: true,
        type: true,
        status: true,
        createdAt: true,
        createdBy: {
          id: true,
          avatar: true,
          username: true,
          email: true
        }
      }
    })

    if (!foundReport) throw new BadRequestError({ message: 'Report not found' })

    foundReport.status = status
    return await foundReport.save()
  }

  getAllReport = async ({ page = 1, limit = 10, sort, type }: ReportQueryReq) => {
    const skip = (page - 1) * limit

    let where: FindOptionsWhere<Report> = {}

    if (type && isValidEnumValue(type, ReportType))
      where = {
        ...where,
        type
      }

    const [reports, total] = await Report.findAndCount({
      skip,
      take: limit,
      order: sort,
      where,
      relations: ['createdBy'],
      select: {
        id: true,
        content: true,
        type: true,
        status: true,
        createdAt: true,
        createdBy: {
          id: true,
          avatar: true,
          username: true,
          email: true
        },
        targetId: true
      }
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
