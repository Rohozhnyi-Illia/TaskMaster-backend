const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');
const NotificationService = require('../../services/notificationService');

describe('Checking deadlines', () => {
  it('Creating and receiving notifications', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const now = new Date();

    const deadlineWeek = new Date(now);
    deadlineWeek.setDate(now.getDate() + 7);

    const deadlinePast = new Date(now);
    deadlinePast.setDate(now.getDate() - 1);

    const deadlineReminder = new Date(now);
    deadlineReminder.setHours(now.getHours() + 5);

    await createTask({
      user: user._id,
      task: 'Warning task',
      deadline: deadlineWeek,
      remainingTime: 24,
    });

    await createTask({
      user: user._id,
      task: 'Overdue task',
      deadline: deadlinePast,
      remainingTime: 48,
    });

    await createTask({
      user: user._id,
      task: 'Reminder task',
      deadline: deadlineReminder,
      remainingTime: 24,
    });

    await NotificationService.checkDeadlines();

    const res = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const types = res.body.data.map((notification) => notification.type);

    expect(types).toContain('warning');
    expect(types).toContain('overdue');
    expect(types).toContain('reminder');
  });

  it('Duplicate creation check', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const now = new Date();
    const deadlineWeek = new Date(now);
    deadlineWeek.setDate(now.getDate() + 7);

    await createTask({
      user: user._id,
      task: 'Warning task',
      deadline: deadlineWeek,
      remainingTime: 24,
    });

    await NotificationService.checkDeadlines();
    await NotificationService.checkDeadlines();

    const res = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.body.data).toHaveLength(1);
  });
});
