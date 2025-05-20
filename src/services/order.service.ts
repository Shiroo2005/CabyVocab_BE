import { CreateOrderFolderBodyReq } from '~/dto/req/exercise/order/createOrderFolderBody.req'
import { exerciseService } from './exercise.service'
import { BadRequestError } from '~/core/error.response'
import { Order } from '~/entities/order.entity'
import { Folder } from '~/entities/folder.entity'
import { User } from '~/entities/user.entity'
import { vnPayService } from './vnpay.service'
import { OrderStatus } from '~/constants/order'

class OrderService {
  //create order + return url vnpay
  createNewOrderFolder = async (userId: number, folderId: number, ip: string) => {
    //find order
    const foundFolder = await exerciseService.findFolderById(folderId)
    if (!foundFolder) throw new BadRequestError({ message: 'Folder id invalid!' })

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
}

export const orderService = new OrderService()
