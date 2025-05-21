import { FindOptionsOrder } from 'typeorm'
import { PayoutStatus } from '~/constants/transaction'
import { Payout } from '~/entities/payout.entity'

export class PayoutQueryReq {
  page?: number
  limit?: number
  status?: PayoutStatus
  amount?: number
  email?: string
  username?: string
  sort?: FindOptionsOrder<Payout>
}
