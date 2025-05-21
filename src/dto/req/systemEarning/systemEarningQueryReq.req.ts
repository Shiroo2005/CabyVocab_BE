import { FindOptionsOrder } from 'typeorm'
import { SystemEarning } from '~/entities/systemEarning.entity'

export class SystemEarningQueryReq {
  page?: number
  limit?: number
  sort?: FindOptionsOrder<SystemEarning>
  orderId?: number
}
