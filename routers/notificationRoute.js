const express = require('express')
const NotificationController = require('../controllers/NotificationController')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/get-notification', authMiddleware, (req, res) => {
  NotificationController.getUserNotifications(req, res)
})

router.patch('/:id/read', authMiddleware, (req, res) => {
  NotificationController.markAsRead(req, res)
})

router.delete('/:id', authMiddleware, (req, res) => {
  NotificationController.delete(req, res)
})

module.exports = router
