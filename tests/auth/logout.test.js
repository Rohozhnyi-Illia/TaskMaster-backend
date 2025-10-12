require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../testServer')
const UserModel = require('../../models/User')
const bcrypt = require('bcrypt')
const TokenModel = require('../../models/Token')

describe('Auth: Logout', () => {
  const testEmail = 'jest4Test@gmail.com'
  const testPassword = '123456'
  let refreshCookie

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)

    await UserModel.deleteOne({ email: testEmail })
    await TokenModel.deleteMany({})

    const hashPassword = await bcrypt.hash(testPassword, 10)
    await UserModel.create({ email: testEmail, password: hashPassword })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200)

    const cookies = loginRes.header['set-cookie']
    refreshCookie = cookies.find((c) => c.startsWith('refreshToken='))
  })

  afterAll(async () => {
    await UserModel.deleteOne({ email: testEmail })
    await TokenModel.deleteMany({})
    console.log('User was deleted')
    await mongoose.connection.close()
  })

  it('should logout and clear refreshToken cookie', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', refreshCookie)
      .expect(200)

    expect(res.body).toHaveProperty('message', 'Successfully logged out')

    const tokenInDb = await TokenModel.findOne({
      refreshToken: refreshCookie.split(';')[0].split('=')[1],
    })
    expect(tokenInDb).toBeNull()

    const cookies = res.header['set-cookie']
    const clearedCookie = cookies.find((c) => c.startsWith('refreshToken='))
    expect(clearedCookie).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/)
  })
})
