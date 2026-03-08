const TaskModel = require('../../models/Task');

const createTask = async (data = {}) => {
  return await TaskModel.create({
    user: data.user,
    task: 'Test Task',
    status: 'Active',
    category: 'High',
    deadline: '2026-03-08T00:00:00.000Z',
    remainingTime: 24,
    order: 0,
    ...data,
  });
};

module.exports = createTask;
