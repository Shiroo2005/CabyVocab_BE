import { BadRequestError } from '~/core/error.response'
import { CreatePayoutBodyReq } from '~/dto/req/payout/createPayoutBody.req'
import { User } from '~/entities/user.entity'
import { DatabaseService } from './database.service'
import { Payout } from '~/entities/payout.entity'
import { PayoutQueryReq } from '~/middlewares/payout/payoutQueryReq'
import { FindOptionsWhere, Like } from 'typeorm'
import { PayoutStatus } from '~/constants/transaction'
import status from 'http-status'

class PayoutService {
  create = async ({ amount, nameBank, numberAccount }: CreatePayoutBodyReq, user: User) => {
    if (!this.checkValidAmountPayout(user, amount))
      throw new BadRequestError({ message: `Amount can not higher than user's balance!` })

    // create a new query runner
    const queryRunner = DatabaseService.getInstance().appDataSource.createQueryRunner()

    // establish real database connection using our new query runner
    await queryRunner.connect()

    // lets now open a new transaction:
    await queryRunner.startTransaction()

    try {
      //decrease balance user
      user.balance -= amount

      //create new payout
      const payout = new Payout()
      payout.amount = amount
      payout.nameBank = nameBank
      payout.numberAccount = numberAccount
      payout.createdBy = user

      await Promise.all([user.save(), payout.save()])
      await queryRunner.commitTransaction()
    } catch (err) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction()
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release()
    }
    return {}
  }

  checkValidAmountPayout = (user: User, amount: number) => {
    //check balance is higher than amount ?
    return user.balance - amount >= 0
  }

  getPayoutListByUser = async (
    userId: number,
    { page = 1, limit = 10, amount, status, sort = { createdAt: 'DESC' } }: PayoutQueryReq
  ) => {
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<Payout> = {
      ...(typeof amount !== 'undefined' && { amount }),
      ...(status && { status }),
      createdBy: {
        id: userId
      }
    }

    const [payouts, total] = await Payout.findAndCount({
      skip,
      take: limit,
      relations: ['createdBy'],
      where,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        createdBy: {
          id: true,
          avatar: true,
          username: true,
          email: true
        },
        nameBank: true,
        numberAccount: true,
        status: true
      },
      order: sort
    })

    return {
      payouts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  getPayoutListByAdmin = async ({
    page = 1,
    limit = 10,
    email = '',
    username = '',
    amount,
    status,
    sort = { createdAt: 'DESC' }
  }: PayoutQueryReq) => {
    const skip = (page - 1) * limit

    const where: any = {
      ...(email && { email: Like(`%${email}%`) }),
      ...(username && { username: Like(`%${username}%`) }),
      ...(typeof amount !== 'undefined' && { amount }),
      ...(status && { status })
    }

    const [payouts, total] = await Payout.findAndCount({
      skip,
      take: limit,
      relations: ['createdBy'],
      where,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        createdBy: {
          id: true,
          avatar: true,
          username: true,
          email: true
        },
        nameBank: true,
        numberAccount: true,
        status: true
      },
      order: sort
    })

    return {
      payouts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    }
  }

  updatePayout = async (status: PayoutStatus, payoutId: number) => {
    const foundPayout = await Payout.findOne({
      where: { id: payoutId },
      relations: ['createdBy'],
      select: {
        id: true,
        amount: true,
        createdBy: {
          id: true,
          balance: true
        },
        nameBank: true,
        numberAccount: true,
        status: true
      }
    })

    if (!foundPayout) throw new BadRequestError({ message: 'Payout id invalid!' })

    //if payout status was rejected, return amount for user
    const user = foundPayout.createdBy
    user.balance += foundPayout.amount
    await user.save()

    //change status
    foundPayout.status = status

    return await foundPayout.save()
  }
}

export const payoutService = new PayoutService()
