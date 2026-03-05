const NotificationService = require('../services/notificationService');

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationService.getNotifications(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const updated = await NotificationService.markAsRead(id);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedNotification = await NotificationService.deleteNotification(id);

      if (!deletedNotification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found',
        });
      }

      res.status(200).json({ success: true, data: deletedNotification });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async deleteReadNotifications(req, res) {
    try {
      const userId = req.user.id;

      const result = await NotificationService.deleteReadNotifications(userId);

      res.status(200).json({
        success: true,
        data: { deletedCount: result.deletedCount },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async deleteAllNotifications(req, res) {
    try {
      const userId = req.user.id;

      const result = await NotificationService.deleteAllNotifications(userId);

      res.status(200).json({
        success: true,
        data: { deletedCount: result.deletedCount },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
}

module.exports = new NotificationController();
