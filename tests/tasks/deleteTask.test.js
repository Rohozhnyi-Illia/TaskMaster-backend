require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../../testServer')

const UserModel = require('../../models/User')
const TaskModel = require('../../models/Task')

describe('Tasks API - Delete Task', () => {
  let token
  let user
  let task

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)

    const testEmail = 'taskDeleteTest@gmail.com'
    const testPassword = '123456'
    const hashedPassword = await bcrypt.hash(testPassword, 10)
    user = await UserModel.create({ email: testEmail, password: hashedPassword })

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200)

    token = res.body.accessToken

    task = await TaskModel.create({
      user: user._id,
      task: 'Temporary task to delete',
      status: 'Active',
      category: 'Low',
      deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
    })
  })

  afterAll(async () => {
    await TaskModel.deleteMany({ user: user._id })
    await UserModel.findByIdAndDelete(user._id)
    console.log('User was deleted')
    await mongoose.connection.close()
  })

  it('should delete a task by ID', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body).toHaveProperty('message', 'Task deleted successfully')

    const deleted = await TaskModel.findById(task._id)
    expect(deleted).toBeNull()
  })
})
