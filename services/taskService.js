const TaskModel = require('../models/Task')
const UserModel = require('../models/User')

class TaskService {
  async getAllTasks(userId) {
    try {
      const tasks = await TaskModel.find({ user: userId }).sort({ createdAt: -1 })
      return tasks
    } catch (error) {
      console.error('Error in getAllTasks service:', error)
      throw new Error('Failed to fetch tasks')
    }
  }

  async createTask(props) {
    try {
      const { userId, task, status, category, deadline, remainingTime } = props

      const newTask = await TaskModel.create({
        user: userId,
        task,
        status,
        category,
        deadline,
        remainingTime: remainingTime || 24,
      })

      return newTask
    } catch (error) {
      console.error('Error in createTask service:', error)
      throw new Error('Task addition error')
    }
  }

  async deleteTask(taskId) {
    try {
      const deletedTask = await TaskModel.findByIdAndDelete(taskId)
      if (!deletedTask) {
        throw new Error('Task not found')
      }
      return deletedTask
    } catch (error) {
      console.error('Error in deleteTask service:', error)
      throw new Error('Task deleted error')
    }
  }

  async updateStatus(taskId, userId, newStatus) {
    try {
      const allowedStatuses = ['Active', 'Done', 'In-progress', 'Archived', 'Blocked']
      if (!allowedStatuses.includes(newStatus)) {
        throw new Error('Invalid status')
      }

      const task = await TaskModel.findOne({ _id: taskId, user: userId })
      if (!task) {
        throw new Error('Task not found or does not belong to the user')
      }

      task.status = newStatus
      await task.save()

      return task
    } catch (error) {
      console.error('Error in updateStatus service:', error)
      throw new Error('Task status update error')
    }
  }
}

module.exports = new TaskService()
