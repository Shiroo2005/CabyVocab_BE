import { NotificationTarget, NotificationType } from '~/constants/notification'
import { Notification } from '~/entities/notification.entity'
import { UserNotification } from '~/entities/userNotification.entity'

class NotificationService {
  createNotification = async (type: NotificationType, data: any, target: NotificationTarget, users: number[]) => {
    const notification = Notification.create({
      data,
      target,
      type
    })

    const newNotification = await notification.save()

    //target notification != all ==> create notification for each user
    if (target != NotificationTarget.ALL) {
      this.createUserNotification(newNotification.id, users)
    }

    return newNotification
  }

  createUserNotification = async (notificationId: number, users: number[]) => {
    const userNotifications = users.map((userId) => {
      return UserNotification.create({
        notification: {
          id: notificationId
        },
        alreadyRead: false,
        user: {
          id: userId
        }
      })
    })

    return await UserNotification.save(userNotifications)
  }
}

export const notificationService = new NotificationService()
