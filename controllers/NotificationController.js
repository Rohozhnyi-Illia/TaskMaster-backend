const NotificationService = require('../services/notificationService')
const NotificationModel = require('../models/Notification')

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id
      const notifications = await NotificationModel.find({ user: userId }).sort({
        createdAt: -1,
      })
      res.json(notifications)
    } catch (error) {
      console.error('Error getting notifications:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params
      const updated = await NotificationService.markAsRead(id)
      res.json(updated)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      await NotificationService.deleteNotification(id)
      res.json({ message: 'Notification deleted successfully' })
    } catch (error) {
      console.error('Error deleting notification:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

module.exports = new NotificationController()
