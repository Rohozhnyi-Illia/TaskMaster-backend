const TaskModel = require('../models/Task')
const NotificationModel = require('../models/Notification')

class NotificationService {
  static async checkDeadlines() {
    const currentDate = new Date()
    const warningDaysArray = [7, 3, 1]

    const tasksWithTimeTracker = await TaskModel.find({
      timeTracker: true,
      status: { $in: ['Active', 'InProgress'] },
      user: { $ne: null },
    }).populate('user')

    for (const task of tasksWithTimeTracker) {
      const differenceMilliseconds = task.deadline - currentDate
      const differenceHours = differenceMilliseconds / (1000 * 60 * 60)
      const differenceDays = Math.ceil(differenceHours / 24)

      const existingOverdueNotification = await NotificationModel.findOne({
        task: task._id,
        type: 'overdue',
      })

      if (
        differenceMilliseconds < 0 &&
        task.status !== 'Done' &&
        !existingOverdueNotification
      ) {
        await NotificationModel.create({
          user: task.user._id,
          task: task._id,
          message: `The task "${task.task}" is overdue! Deadline has passed.`,
          type: 'overdue',
          isRead: false,
          isDismissed: false,
        })
      }

      for (const warningDay of warningDaysArray) {
        const existingWarningNotification = await NotificationModel.findOne({
          task: task._id,
          type: 'warning',
          'meta.warningDay': warningDay,
        })

        if (
          differenceDays === warningDay &&
          differenceMilliseconds > 0 &&
          !existingWarningNotification
        ) {
          await NotificationModel.create({
            user: task.user._id,
            task: task._id,
            message: `Don't forget the task "${task.task}"! Only ${warningDay} day(s) left.`,
            type: 'warning',
            meta: { warningDay: warningDay },
            isRead: false,
            isDismissed: false,
          })
        }
      }

      const existingReminderNotification = await NotificationModel.findOne({
        task: task._id,
        type: 'reminder',
        'meta.reminderHour': task.remainingTime,
      })

      if (
        task.remainingTime > 0 &&
        differenceHours > 0 &&
        differenceHours <= task.remainingTime &&
        !existingReminderNotification
      ) {
        await NotificationModel.create({
          user: task.user._id,
          task: task._id,
          message: `Reminder: Your task "${task.task}" is due in ${Math.ceil(differenceHours)} hours!`,
          type: 'reminder',
          meta: { reminderHour: task.remainingTime },
          isRead: false,
          isDismissed: false,
        })
      }
    }
  }

  static async getNotifications(userId) {
    const notificationsForUser = await NotificationModel.find({
      user: userId,
      isDismissed: false,
    }).sort({ createdAt: -1 })

    return notificationsForUser
  }

  static async markAsRead(notificationId) {
    try {
      const updatedNotification = await NotificationModel.findOneAndUpdate(
        { _id: notificationId, isDismissed: false },
        { isRead: true },
        { new: true },
      )
      return updatedNotification
    } catch (error) {
      throw new Error('Error marking notification as read')
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const updatedNotification = await NotificationModel.findByIdAndUpdate(
        notificationId,
        { isDismissed: true, dismissedAt: new Date() },
        { new: true },
      )
      return updatedNotification
    } catch (error) {
      throw new Error('Error dismissing notification')
    }
  }

  static async deleteReadNotifications(userId) {
    try {
      const readNotifications = await NotificationModel.find({
        user: userId,
        isRead: true,
        isDismissed: false,
      })

      if (!readNotifications.length) return { success: true, deletedCount: 0 }

      const readNotificationIds = readNotifications.map((notification) => notification._id)

      await NotificationModel.updateMany(
        { _id: { $in: readNotificationIds } },
        { isDismissed: true, dismissedAt: new Date() },
      )

      return { success: true, deletedCount: readNotifications.length }
    } catch (error) {
      throw new Error('Error dismissing read notifications')
    }
  }

  static async deleteAllNotifications(userId) {
    try {
      const allNotifications = await NotificationModel.find({
        user: userId,
        isDismissed: false,
      })

      if (!allNotifications.length) return { success: true, deletedCount: 0 }

      const allNotificationIds = allNotifications.map((notification) => notification._id)

      await NotificationModel.updateMany(
        { _id: { $in: allNotificationIds } },
        { isDismissed: true, dismissedAt: new Date() },
      )

      return { success: true, deletedCount: allNotifications.length }
    } catch (error) {
      throw new Error('Error dismissing all notifications')
    }
  }
}

module.exports = NotificationService
