const TaskModel = require('../models/Task')
const UserModel = require('../models/User')

class TaskService {
  async createTask(props) {
    try {
      const { userId, task, status, category, deadline, remainingTime, timeTracker } = props

      const newTask = await TaskModel.create({
        user: userId,
        task,
        status,
        category,
        deadline,
        remainingTime: remainingTime || 24,
        timeTracker: timeTracker || true,
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
}

module.exports = new TaskService()
