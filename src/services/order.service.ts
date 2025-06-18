import { exerciseService } from './exercise.service'
import { BadRequestError } from '~/core/error.response'
import { Order } from '~/entities/order.entity'
import { Folder } from '~/entities/folder.entity'
import { User } from '~/entities/user.entity'
import { vnPayService } from './vnpay.service'
import { OrderStatus, PROFIT_RATE } from '~/constants/order'
import { parse } from 'date-fns'
import { VerifyReturnUrl } from 'vnpay'
import { userService } from './user.service'
import { systemEarningService } from './systemEarning.service'

class OrderService {
  //create order + return url vnpay
  createNewOrderFolder = async (userId: number, folderId: number, ip: string) => {
    //find order
    const foundFolder = await exerciseService.findFolderById(folderId)
    if (!foundFolder) throw new BadRequestError({ message: 'Folder id invalid!' })

    //check if order was create before
    const foundOrder = await Order.findOne({
      where: {
        folder: {
          id: folderId
        },
        createdBy: {
          id: userId
        }
      }
    })
    if (foundOrder) throw new BadRequestError({ message: 'Order was exits' })

    //create order
    const order = await this.createOrder({ folder: foundFolder, userId })

    //if free dont create orderUrl
    if (order.amount == 0) {
      order.status = OrderStatus.SUCCESS
      return {
        order,
        orderUrl: null
      }
    }

    //create order url
    const orderUrl = vnPayService.createPaymentUrl(order, ip)

    return {
      orderUrl,
      order
    }
  }

  createOrder = async ({ folder, userId }: { folder: Folder; userId: number }) => {
    //create new order
    const order = new Order()

    //mapping data
    order.folder = folder

    order.createdBy = {
      id: userId
    } as User

    order.amount = folder.price

    return await order.save()
  }

  updateOrder = async ({ isSuccess, vnp_BankCode, vnp_BankTranNo, vnp_PayDate, vnp_TxnRef }: VerifyReturnUrl) => {
    //update status

    const foundOrder = await Order.findOne({
      where: {
        id: parseInt(vnp_TxnRef)
      },
      select: {
        id: true,
        amount: true,
        bankTranNo: true,
        folder: {
          id: true,
          createdBy: {
            id: true
          }
        },
        createdBy: {
          id: true
        }
      },
      relations: ['folder', 'folder.createdBy', 'createdBy']
    })

    if (!foundOrder) throw new BadRequestError({ message: 'Order not exist!' })
    if (isSuccess) {
      //update order

      foundOrder.bankTranNo = vnp_BankTranNo as string
      foundOrder.nameBank = vnp_BankCode as string
      foundOrder.status = OrderStatus.SUCCESS
      foundOrder.payDate = parse(vnp_PayDate as string, 'yyyyMMddHHmmss', new Date())
      foundOrder.save()

      await this.updateSystemEarningAndBalanceUser(foundOrder.amount, foundOrder)
    }

    return foundOrder
  }

  updateSystemEarningAndBalanceUser = async (amount: number, foundOrder: Order) => {
    const systemEarningAmount = amount * PROFIT_RATE
    return await Promise.all([
      //update balance
      await userService.updateBalance(foundOrder.folder.createdBy.id as number, foundOrder.amount),
      systemEarningService.addAmount(systemEarningAmount, foundOrder.id)
    ])
  }
}

export const orderService = new OrderService()
