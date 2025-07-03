import { SystemEarningQueryReq } from '~/dto/req/systemEarning/systemEarningQueryReq.req'
import { Order } from '~/entities/order.entity'
import { SystemEarning } from '~/entities/systemEarning.entity'
import dayjs from 'dayjs'

class SystemEarningService {
  async addAmount(amount: number, orderId: string) {
    const systemEarning = new SystemEarning()
    systemEarning.amount = amount
    systemEarning.order = {
      id: orderId
    } as Order

    return await systemEarning.save()
  }

  getAllSystemEarning = async ({ page = 1, limit = 10, orderId, sort }: SystemEarningQueryReq) => {
    const skip = (page - 1) * limit

    const where: any = {}

    if (orderId) {
      where.orderId = orderId
    }

    const [systemEarnings, total] = await SystemEarning.findAndCount({
      skip,
      take: limit,
      where,
      order: sort,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        order: {
          id: true,
          amount: true,
          bankTranNo: true,
          nameBank: true,
          createdBy: {
            id: true,
            username: true
          }
        }
      },
      relations: ['order', 'order.createdBy']
    })

    return {
      systemEarnings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  async getRevenueStats() {
    const total = await this.getTotalRevenue()
    const weekly = await this.getDailyRevenueLast7Days()
    const monthly = await this.getWeeklyRevenueInCurrentMonth()
    const yearly = await this.getMonthlyRevenueInCurrentYear()

    return {
      total,
      weekly,
      monthly,
      yearly
    }
  }

  // ✅ Tổng doanh thu
  private async getTotalRevenue(): Promise<number> {
    const { total } = await SystemEarning.createQueryBuilder('se').select('SUM(se.amount)', 'total').getRawOne()
    return Number(total || 0)
  }

  // ✅ Doanh thu 7 ngày qua (mỗi ngày)
  private async getDailyRevenueLast7Days(): Promise<{ date: string; total: number }[]> {
    const now = dayjs()
    const days = Array.from({ length: 7 }).map((_, i) => now.subtract(i, 'day'))

    const revenues = await Promise.all(
      days.map(async (date) => {
        const start = date.startOf('day').toDate()
        const end = date.endOf('day').toDate()

        const { total } = await SystemEarning.createQueryBuilder('se')
          .select('SUM(se.amount)', 'total')
          .where('se.createdAt BETWEEN :start AND :end', { start, end })
          .getRawOne()

        return {
          date: date.format('YYYY-MM-DD'),
          total: Number(total || 0)
        }
      })
    )

    return revenues.reverse()
  }

  // ✅ Doanh thu theo tuần (4 tuần đầu tháng)
  private async getWeeklyRevenueInCurrentMonth(): Promise<{ week: string; total: number }[]> {
    const startOfMonth = dayjs().startOf('month')

    const revenues: { week: string; total: number }[] = []

    for (let i = 0; i < 4; i++) {
      const start = startOfMonth.add(i * 7, 'day')
      const end = start.add(6, 'day')

      const { total } = await SystemEarning.createQueryBuilder('se')
        .select('SUM(se.amount)', 'total')
        .where('se.createdAt BETWEEN :start AND :end', {
          start: start.startOf('day').toDate(),
          end: end.endOf('day').toDate()
        })
        .getRawOne()

      revenues.push({
        week: `Week ${i + 1}`,
        total: Number(total || 0)
      })
    }

    return revenues
  }

  // ✅ Doanh thu theo 12 tháng trong năm
  private async getMonthlyRevenueInCurrentYear(): Promise<{ month: string; total: number }[]> {
    const startOfYear = dayjs().startOf('year')

    const revenues = await Promise.all(
      Array.from({ length: 12 }).map(async (_, i) => {
        const monthStart = startOfYear.month(i).startOf('month')
        const monthEnd = monthStart.endOf('month')

        const { total } = await SystemEarning.createQueryBuilder('se')
          .select('SUM(se.amount)', 'total')
          .where('se.createdAt BETWEEN :start AND :end', {
            start: monthStart.toDate(),
            end: monthEnd.toDate()
          })
          .getRawOne()

        return {
          month: monthStart.format('MMM'),
          total: Number(total || 0)
        }
      })
    )

    return revenues
  }
}

export const systemEarningService = new SystemEarningService()
