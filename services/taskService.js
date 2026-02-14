const TaskModel = require('../models/Task')
const NotificationModel = require('../models/Notification')

class TaskService {
  async getAllTasks(userId) {
    try {
      const tasks = await TaskModel.find({ user: userId }).sort({ order: 1 })
      return tasks
    } catch (error) {
      throw new Error('Failed to fetch tasks')
    }
  }

  async createTask(props) {
    try {
      const { userId, task, status, category, deadline, remainingTime } = props

      const lastTask = await TaskModel.findOne({ user: userId }).sort({ order: -1 })
      const newOrder = lastTask ? lastTask.order + 1 : 0

      const newTask = await TaskModel.create({
        user: userId,
        task,
        status,
        category,
        deadline,
        remainingTime: remainingTime !== undefined ? remainingTime : 24,
        order: newOrder,
      })

      return newTask
    } catch (error) {
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
      throw new Error('Task deleted error')
    }
  }

  async updateStatus(taskId, userId, newStatus) {
    try {
      const allowedStatuses = ['Active', 'Done', 'InProgress', 'Archived']
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
      throw new Error('Task status update error')
    }
  }

  async reorderTasks(userId, orderedIds) {
    try {
      if (!Array.isArray(orderedIds)) {
        throw new Error('Invalid data format')
      }

      const bulkOps = orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, user: userId },
          update: { order: index },
        },
      }))

      await TaskModel.bulkWrite(bulkOps)

      return true
    } catch (error) {
      throw new Error('Reorder failed')
    }
  }
}

module.exports = new TaskService()
