require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../../testServer')

const UserModel = require('../../models/User')
const TaskModel = require('../../models/Task')

describe('Tasks API - Add Task', () => {
  let token
  let user

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)

    const testEmail = 'taskAddTest@gmail.com'
    const testPassword = '123456'
    const hashedPassword = await bcrypt.hash(testPassword, 10)
    user = await UserModel.create({ email: testEmail, password: hashedPassword })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200)

    token = res.body.accessToken
  })

  afterAll(async () => {
    await TaskModel.deleteMany({ user: user._id })
    await UserModel.findByIdAndDelete(user._id)
    console.log('User was deleted')
    await mongoose.connection.close()
  })

  it('should create a new task for authenticated user', async () => {
    const newTask = {
      task: 'Write tests for add task',
      status: 'Active',
      category: 'High',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      remainingTime: 5,
      timeTracker: true,
    }

    const res = await request(app)
      .post('/api/tasks/add-task')
      .set('Authorization', `Bearer ${token}`)
      .send(newTask)
      .expect(201)

    expect(res.body).toHaveProperty('_id')
    expect(res.body).toHaveProperty('task', newTask.task)
    expect(res.body).toHaveProperty('status', 'Active')

    const taskInDB = await TaskModel.findById(res.body._id)
    expect(taskInDB).not.toBeNull()
  })
})
