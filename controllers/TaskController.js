const TaskModel = require('../models/Task')
const UserModel = require('../models/User')
const TaskService = require('../services/taskService')

class TaskController {
  async createTask(req, res) {
    try {
      const userId = req.user._id
      const { task, status, category, deadline, remainingTime, timeTracker } = req.body

      const result = await TaskService.createTask({
        userId,
        task,
        status,
        category,
        deadline,
        remainingTime,
        timeTracker,
      })

      res.status(201).json(result)
    } catch (error) {
      console.error('Error in createTask controller:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params
      const deletedTask = await TaskService.deleteTask(id)
      res.status(200).json({ message: 'Task deleted successfully', task: deletedTask })
    } catch (error) {
      console.error('Error in deleteTask controller:', error)
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }
}

module.exports = new TaskController()
