const TaskModel = require('../models/Task')
const UserModel = require('../models/User')
const TaskService = require('../services/taskService')

class TaskController {
  async getAllTasks(req, res) {
    try {
      const userId = req.user._id
      const tasks = await TaskService.getAllTasks(userId)

      res.status(200).json(tasks)
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      })
    }
  }

  async createTask(req, res) {
    try {
      const userId = req.user._id
      const { task, status, category, deadline, remainingTime } = req.body

      const result = await TaskService.createTask({
        userId,
        task,
        status,
        category,
        deadline,
        remainingTime,
      })

      res.status(201).json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params
      const deletedTask = await TaskService.deleteTask(id)
      res.status(200).json({ message: 'Task deleted successfully', task: deletedTask })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async updateStatus(req, res) {
    try {
      const userId = req.user._id
      const { id } = req.params
      const { status } = req.body

      const updatedTask = await TaskService.updateStatus(id, userId, status)

      res.status(200).json({
        message: 'Task status updated successfully',
        task: updatedTask,
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async reorderTasks(req, res) {
    try {
      const userId = req.user._id
      const { orderedIds } = req.body

      await TaskService.reorderTasks(userId, orderedIds)

      res.status(200).json({
        message: 'Tasks reordered successfully',
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = new TaskController()
