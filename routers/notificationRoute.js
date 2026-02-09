const express = require('express')
const NotificationController = require('../controllers/NotificationController')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, (req, res) => {
  NotificationController.getUserNotifications(req, res)
})

router.get('/count', authMiddleware, (req, res) => {
  NotificationController.getNotificationsCount(req, res)
})

router.patch('/:id/read', authMiddleware, (req, res) => {
  NotificationController.markAsRead(req, res)
})

router.patch('/readAll', authMiddleware, (req, res) => {
  NotificationController.deleteReadNotifications(req, res)
})

router.patch('/deleteAll', authMiddleware, (req, res) => {
  NotificationController.deleteAllNotifications(req, res)
})

router.delete('/:id', authMiddleware, (req, res) => {
  NotificationController.delete(req, res)
})

module.exports = router
