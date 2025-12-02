const jwt = require('jsonwebtoken')
const TokenModel = require('../models/Token')

class TokenService {
  generateToken(payload) {
    try {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
      })

      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      })

      return { accessToken, refreshToken }
    } catch (error) {
      console.error('Error in generateToken:', error)
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      return null
    }
  }

  async saveToken(userId, refreshToken) {
    try {
      await TokenModel.findOneAndUpdate(
        { user: userId },
        { refreshToken },
        { upsert: true, new: true }
      )
    } catch (error) {
      console.error('Error in saveToken:', error)
      return null
    }
  }

  async removeToken(userId) {
    try {
      await TokenModel.deleteOne({ user: userId })
    } catch (error) {
      console.error('Error in removeToken:', error)
      return null
    }
  }

  async findToken(userId) {
    try {
      return await TokenModel.findOne({ user: userId })
    } catch (error) {
      console.error('Error in findToken:', error)
      return null
    }
  }

  async refreshToken(oldRefreshToken) {
    try {
      if (!oldRefreshToken) return null

      const userData = this.validateRefreshToken(oldRefreshToken)
      if (!userData) return null

      const tokenFromDB = await TokenModel.findOne({ user: userData.id })
      if (!tokenFromDB) return null

      if (tokenFromDB.refreshToken !== oldRefreshToken) {
        return null
      }

      const tokens = this.generateToken({ id: userData.id })

      tokenFromDB.refreshToken = tokens.refreshToken
      await tokenFromDB.save()

      return tokens
    } catch (error) {
      console.error('Error in refreshToken:', error)
      return null
    }
  }
}

module.exports = new TokenService()
