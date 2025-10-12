const TaskModel = require('../models/Task')
const UserModel = require('../models/User')

class TaskService {
  async createTask(props) {
    try {
      const { userId, task, status, category, deadline } = props
    } catch (error) {}
  }
}

module.exports = TaskService
