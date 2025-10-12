const express = require('express')
const TaskController = require('../controllers/TaskController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/add-task', authMiddleware, (req, res) => {
  TaskController.createTask(req, res)
})

router.delete('/:id', authMiddleware, (req, res) => {
  TaskController.deleteTask(req, res)
})

module.exports = router
