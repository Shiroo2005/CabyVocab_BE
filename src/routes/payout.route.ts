import express from 'express'
import { Resource } from '~/constants/access'
import { payoutController } from '~/controllers/payout.controller'
import { Payout } from '~/entities/payout.entity'
import { accessTokenValidation, checkPermission, checkVerifyUser } from '~/middlewares/auth.middlewares'
import {
  checkIdParamMiddleware,
  checkQueryMiddleware,
  parseSort,
  requireJsonContent
} from '~/middlewares/common.middlewares'
import { validateCreatePayout } from '~/middlewares/payout/createPayoutBody.middleware'
import { updatePayoutBodyValidation } from '~/middlewares/payout/updatePayoutBody.middleware'
import { wrapRequestHandler } from '~/utils/handler'

export const payoutRouter = express.Router()

payoutRouter.use(accessTokenValidation)
payoutRouter.use(checkVerifyUser)

//GET
/**
 * @description : get list payout
 * @method : GET
 * @path : /
 * @query : {
  {
    page?: number
    limit?: number
    status?: PayoutStatus
    amount?: number
    email?: string
    username?: string
    sort?: FindOptionsOrder<Payout>
  }
}

**/
payoutRouter.get(
  '/',
  checkQueryMiddleware(),
  wrapRequestHandler(parseSort({ allowSortList: Payout.sortAllowList })),
  wrapRequestHandler(payoutController.getListPayout)
)

//POST
/**
 * @description : create new payout
 * @method : POST
 * @path : /
 * @body : {
  amount: number
  numberAccount: string
  nameBank: string
}

**/
payoutRouter.post(
  '/',
  wrapRequestHandler(requireJsonContent),
  validateCreatePayout,
  wrapRequestHandler(payoutController.createPayout)
)

//PUT
/**
 * @description : update payout
 * @method : PUT
 * @path : /:id
 * @body : {
    status: PAYOUT_STATUS [SUCCESS, REJECT]
}

**/
payoutRouter.put(
  '/:id',
  wrapRequestHandler(checkPermission('updateAny', Resource.PAYOUT)),
  wrapRequestHandler(requireJsonContent),
  wrapRequestHandler(checkIdParamMiddleware),
  updatePayoutBodyValidation,
  wrapRequestHandler(payoutController.updatePayout)
)
