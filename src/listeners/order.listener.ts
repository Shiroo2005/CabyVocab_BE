import { sendMessage } from '~/sockets'
import { EVENTS } from '~/events/constants'
import { notificationService } from '~/services/notification.service'
import { NotificationTarget, NotificationType } from '~/constants/notification'
import eventBus from '~/events/eventBus'
import { User } from '~/entities/user.entity'
import { Order } from '~/entities/order.entity'

eventBus.on(
  EVENTS.ORDER,
  async ({ buyer, ownerId, folderId, order }: { buyer: User; ownerId: number; folderId: number; order: Order }) => {
    //create notification
    const { ownerNotification, buyerNotification } = await createOrderNotification(buyer, ownerId, folderId, order)

    //send notification
    sendMessage({ event: 'notification', userId: ownerId, data: ownerNotification })
    sendMessage({
      event: 'notification',
      userId: buyer.id as number,
      data: buyerNotification
    })
  }
)

const createOrderNotification = async (buyer: User, ownerId: number, folderId: number, order: Order) => {
  //notification for owner
  const ownerNotification = await notificationService.createNotification(
    NotificationType.ORDER,
    {
      message: `Folder ${folderId} của bạn đã được ${buyer.username} mua`,
      data: {
        ownerId,
        buyer: {
          id: buyer.id,
          username: buyer.username,
          avatar: buyer.avatar,
          email: buyer.email
        },
        order: {
          id: order.id
        }
      }
    },
    NotificationTarget.ONLY_USER,
    [ownerId]
  )

  //send notification for parent comment owner
  //notification for owner
  const buyerNotification = await notificationService.createNotification(
    NotificationType.ORDER,
    {
      message: `Bạn đã mua đơn hàng ${order.id} thành công`,
      data: {
        ownerId,
        buyer: {
          id: buyer.id,
          username: buyer.username,
          avatar: buyer.avatar,
          email: buyer.email
        },
        order: {
          id: order.id
        }
      }
    },
    NotificationTarget.ONLY_USER,
    [buyer.id as number]
  )

  return {
    ownerNotification,
    buyerNotification
  }
}
