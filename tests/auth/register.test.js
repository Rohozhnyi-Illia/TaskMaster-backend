require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../testServer')
const UserModel = require('../../models/User')

describe('Auth: Registration', () => {
  const testEmail = 'jest0Test@gmail.com'
  const testPassword = '123456'

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      try {
        await UserModel.deleteOne({ email: testEmail })
        console.log('User was deleted')
      } catch (err) {
        console.error('Error deleting test user:', err)
      }
      await mongoose.connection.close()
    }
  })

  it('should register a new user and set refreshToken cookie', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: testEmail, password: testPassword })
      .expect(200)

    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('email', testEmail)
    expect(res.body).toHaveProperty('accessToken')

    const cookies = res.header['set-cookie']
    expect(cookies).toBeDefined()
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='))
    expect(refreshCookie).toBeDefined()
    expect(refreshCookie).toMatch(/HttpOnly/)
  })
})
