const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');
const TaskModel = require('../../models/Task');

describe('Reorder Task Flow', () => {
  it('Reorder tasks', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const task1 = await createTask({ user: user._id, task: 'Task 1', order: 0 });
    const task2 = await createTask({ user: user._id, task: 'Task 2', order: 1 });
    const task3 = await createTask({ user: user._id, task: 'Task 3', order: 2 });

    const res = await request(app)
      .patch('/api/tasks/reorder')
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({
        orderedIds: [task3._id, task1._id, task2._id],
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toBe('Reordered successfully');

    const tasks = await TaskModel.find({ user: user._id }).sort({ order: 1 });

    expect(tasks[0]._id.toString()).toBe(task3._id.toString());
    expect(tasks[1]._id.toString()).toBe(task1._id.toString());
    expect(tasks[2]._id.toString()).toBe(task2._id.toString());
  });
});
