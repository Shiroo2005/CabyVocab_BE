import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RoleName } from '~/constants/access'
import { PayoutStatus } from '~/constants/transaction'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreatePayoutBodyReq } from '~/dto/req/payout/createPayoutBody.req'
import { User } from '~/entities/user.entity'
import { payoutService } from '~/services/payout.service'

class PayoutController {
  createPayout = async (req: Request<ParamsDictionary, any, CreatePayoutBodyReq>, res: Response) => {
    const user = req.user as User

    return new CREATED({
      message: 'Create payout successful!',
      metaData: await payoutService.create(req.body, user)
    }).send(res)
  }

  getListPayout = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
    const user = req.user as User

    let result
    if (user.role?.name == RoleName.ADMIN)
      result = await payoutService.getPayoutListByAdmin({
        ...req.parseQueryPagination,
        sort: req.sortParsed,
        ...req.query
      })
    else
      result = await payoutService.getPayoutListByUser(user.id as number, {
        ...req.parseQueryPagination,
        sort: req.sortParsed,
        ...req.query
      })

    return new SuccessResponse({
      message: 'Get payout list successful!',
      metaData: result
    }).send(res)
  }

  updatePayout = async (req: Request<ParamsDictionary, any, { status: PayoutStatus }>, res: Response) => {
    const id = parseInt(req.params.id)

    return new SuccessResponse({
      message: 'Update payout successful!',
      metaData: await payoutService.updatePayout(req.body.status, id)
    }).send(res)
  }
}

export const payoutController = new PayoutController()
