const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');
const NotificationService = require('../../services/notificationService');
const NotificationModel = require('../../models/Notification');

describe('Mark as read flow', () => {
  it('Mark as read', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const now = new Date();
    const deadlineWeek = new Date(now);
    deadlineWeek.setDate(now.getDate() + 7);

    const task = await createTask({
      user: user._id,
      task: 'Warning task',
      deadline: deadlineWeek,
      remainingTime: 24,
    });

    await NotificationService.checkDeadlines();
    const notifications = await NotificationModel.find({ task: task._id });
    const notification = notifications[0];

    const res = await request(app)
      .patch(`/api/notification/${notification._id}/read`)
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      _id: expect.any(String),
      isRead: true,
    });
  });
});
