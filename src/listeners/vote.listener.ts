import { getIO, getSocketIdByUserId } from '~/sockets'
import { EVENTS } from '~/events/constants'
import { notificationService } from '~/services/notification.service'
import { NotificationTarget, NotificationType } from '~/constants/notification'
import eventBus from '~/events/eventBus'
import { User } from '~/entities/user.entity'
import { TargetType } from '~/constants/target'

eventBus.on(
  EVENTS.VOTE,
  async ({
    createdBy,
    ownerId,
    targetId,
    targetType
  }: {
    targetId: number
    ownerId: number
    createdBy: User
    targetType: TargetType
  }) => {
    //create notification
    const notification = await createVoteNotification(targetId, targetType, ownerId, createdBy)

    //send notification

    const io = getIO()
    const socketId = getSocketIdByUserId(ownerId.toString())
    if (socketId) {
      io.to(socketId).emit('notification', notification)
    }
  }
)

const createVoteNotification = async (targetId: number, targetType: TargetType, ownerId: number, createdBy: User) => {
  const newNotification = await notificationService.createNotification(
    NotificationType.VOTE,
    {
      message: `${targetType} của bạn đã được ${createdBy.username} like`,
      data: {
        targetId,
        targetType,
        ownerId,
        createdBy: {
          id: createdBy.id,
          email: createdBy.email,
          username: createdBy.username,
          avatar: createdBy.avatar
        }
      }
    },
    NotificationTarget.ONLY_USER,
    [ownerId]
  )

  return newNotification
}
