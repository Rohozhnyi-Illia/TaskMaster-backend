const TaskModel = require('../models/Task')
const NotificationModel = require('../models/Notification')

class NotificationService {
  static async checkDeadlines() {
    const now = new Date()

    const tasks = await TaskModel.find({
      timeTracker: true,
      status: { $in: ['Active', 'InProgress'] },
      user: { $ne: null },
    }).populate('user')

    const warningDays = [7, 3, 1]

    for (const task of tasks) {
      const diffMs = task.deadline - now
      const diffHours = diffMs / (1000 * 60 * 60)
      const diffDays = Math.ceil(diffHours / 24)

      if (diffMs < 0 && task.status !== 'Done') {
        const exists = await NotificationModel.findOne({
          task: task._id,
          type: 'overdue',
        })
        if (!exists) {
          await NotificationModel.create({
            user: task.user._id,
            task: task._id,
            message: `The task "${task.task}" is overdue! Deadline has passed.`,
            type: 'overdue',
            isRead: false,
          })
        }
      }

      for (const day of warningDays) {
        if (diffDays === day && diffMs > 0) {
          const exists = await NotificationModel.findOne({
            task: task._id,
            type: 'warning',
            'meta.warningDay': day,
          })
          if (!exists) {
            await NotificationModel.create({
              user: task.user._id,
              task: task._id,
              message: `Don't forget the task "${task.task}"! Only ${day} day(s) left.`,
              type: 'warning',
              isRead: false,
              meta: { warningDay: day },
            })
          }
        }
      }

      if (task.remainingTime > 0) {
        const exists = await NotificationModel.findOne({
          task: task._id,
          type: 'reminder',
        })

        if (!exists && diffHours <= task.remainingTime) {
          await NotificationModel.create({
            user: task.user._id,
            task: task._id,
            message: `Reminder: Your task "${task.task}" is due in ${Math.ceil(
              diffHours,
            )} hours!`,
            type: 'reminder',
            isRead: false,
            meta: { reminderHour: task.remainingTime },
          })
        }
      }
    }
  }

  static async markAsRead(notificationId) {
    try {
      return NotificationModel.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true },
      )
    } catch (error) {
      throw new Error('Read notification error')
    }
  }

  static async deleteNotification(notificationId) {
    try {
      return NotificationModel.findByIdAndDelete(notificationId)
    } catch (error) {
      throw new Error('Delete notification error')
    }
  }

  static async deleteReadNotifications(userId) {
    try {
      return NotificationModel.deleteMany({
        user: userId,
        isRead: true,
      })
    } catch (error) {
      throw new Error('Delete read notification error')
    }
  }

  static async deleteAllNotifications(userId) {
    try {
      return NotificationModel.deleteMany({
        user: userId,
      })
    } catch (error) {
      throw new Error('Delete all notifications error')
    }
  }
}

module.exports = NotificationService
