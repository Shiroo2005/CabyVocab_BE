import { FindOptionsOrder } from 'typeorm'
import { Order } from '~/entities/order.entity'

export class OrderQueryReq {
  page?: number
  limit?: number
  bankName?: string
  email?: string
  username?: string
  sort?: FindOptionsOrder<Order>
}
