const TaskService = require('../services/taskService');

class TaskController {
  async getAllTasks(req, res) {
    try {
      const userId = req.user._id;
      const tasks = await TaskService.getAllTasks(userId);

      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async createTask(req, res) {
    try {
      const userId = req.user._id;
      const { task, status, category, deadline, remainingTime } = req.body;

      const result = await TaskService.createTask({
        userId,
        task,
        status,
        category,
        deadline,
        remainingTime,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const deletedTask = await TaskService.deleteTask(id);
      res.status(200).json({ success: true, data: deletedTask });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const { status } = req.body;

      const updatedTask = await TaskService.updateStatus(id, userId, status);

      res.status(200).json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const { category } = req.body;

      const updatedTask = await TaskService.updateCategory(id, userId, category);

      res.status(200).json({
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async reorderTasks(req, res) {
    try {
      const userId = req.user._id;
      const { orderedIds } = req.body;

      await TaskService.reorderTasks(userId, orderedIds);

      res.status(200).json({
        success: true,
        data: { message: 'Reordered successfully' },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
}

module.exports = new TaskController();
