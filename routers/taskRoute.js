const express = require('express')
const TaskController = require('../controllers/TaskController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, (req, res) => {
  TaskController.getAllTasks(req, res)
})

router.post('/', authMiddleware, (req, res) => {
  TaskController.createTask(req, res)
})

router.delete('/:id', authMiddleware, (req, res) => {
  TaskController.deleteTask(req, res)
})

router.patch('/:id/status', authMiddleware, (req, res) => {
  TaskController.updateStatus(req, res)
})

module.exports = router
