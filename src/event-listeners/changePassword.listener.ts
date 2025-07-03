import { getIO, getSocketIdByUserId } from '~/sockets'
import { EVENTS } from '~/events-handler/constants'
import { notificationService } from '~/services/notification.service'
import { NotificationTarget, NotificationType } from '~/constants/notification'
import eventBus from '~/events-handler/eventBus'

eventBus.on(EVENTS.CHANGE_PASSWORD, async ({ userId }) => {
  //create notification
  const notification = await createdChangePasswordNotification(userId)

  //send notification

  const io = getIO()
  const socketId = getSocketIdByUserId(userId.toString())
  if (socketId) {
    io.to(socketId).emit('notification', notification)
  }
})

const createdChangePasswordNotification = async (userId: number) => {
  const newNotification = await notificationService.createNotification(
    NotificationType.CHANGE_PASSWORD,
    {
      message: 'Mật khẩu của bạn đã được đổi!',
      data: null
    },
    NotificationTarget.ONLY_USER,
    [userId]
  )

  return newNotification
}
