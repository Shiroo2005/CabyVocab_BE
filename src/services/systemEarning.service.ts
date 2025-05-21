import { SystemEarningQueryReq } from '~/dto/req/systemEarning/systemEarningQueryReq.req'
import { Order } from '~/entities/order.entity'
import { SystemEarning } from '~/entities/systemEarning.entity'

class SystemEarningService {
  async addAmount(amount: number, orderId: number) {
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
}

export const systemEarningService = new SystemEarningService()
