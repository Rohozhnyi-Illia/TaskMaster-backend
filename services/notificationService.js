const TaskModel = require('../models/Task')
const NotificationModel = require('../models/Notification')

class NotificationService {
  static async checkDeadlines() {
    const now = new Date()
    const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const tasks = await TaskModel.find({ timeTracker: true }).populate('user')

    for (const task of tasks) {
      const diffMs = task.deadline - now
      const diffHours = diffMs / (1000 * 60 * 60)
      const diffDays = Math.ceil(diffHours / 24)

      let message = null
      let type = null

      if (diffMs < 0 && task.status !== 'Done') {
        message = `The task "${task.task}" is overdue! Deadline has passed.`
        type = 'overdue'
      } else if (task.deadline <= weekAhead && diffMs > 0 && diffDays <= 7) {
        message = `Don't forget the task "${task.task}" that needs to be done! Only ${diffDays} days left, get started now!`
        type = 'warning'
      } else if (diffHours <= task.remainingTime && diffHours > 0) {
        message = `Reminder: Your task "${task.task}" is due in ${Math.ceil(diffHours)} hours!`
        type = 'reminder'
      }

      if (message && type) {
        const alreadyExists = await NotificationModel.findOne({
          task: task._id,
          type,
        })

        if (!alreadyExists) {
          await NotificationModel.create({
            user: task.user._id,
            task: task._id,
            message,
            type,
          })
          console.log(`📩 Notification created for ${task.user.email}: ${message}`)
        }
      }
    }
  }

  static async markAsRead(notificationId) {
    return NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true })
  }

  static async deleteNotification(notificationId) {
    return NotificationModel.findByIdAndDelete(notificationId)
  }
}

module.exports = NotificationService
