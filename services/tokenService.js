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
      const tokenData = await TokenModel.findOne({ user: userId })

      if (tokenData) {
        tokenData.refreshToken = refreshToken
        return tokenData.save()
      }

      return await TokenModel.create({ user: userId, refreshToken })
    } catch (error) {
      console.error('Error in saveToken:', error)
      return new Error(error)
    }
  }

  async removeToken(refreshToken) {
    try {
      return await TokenModel.deleteOne({ refreshToken })
    } catch (error) {
      console.error('Error in removeToken:', error)
      return new Error(error)
    }
  }

  async findToken(refreshToken) {
    try {
      return await TokenModel.findOne({ refreshToken })
    } catch (error) {
      console.error('Error in findToken:', error)
      return new Error(error)
    }
  }

  async refreshToken(oldRefreshToken) {
    try {
      const userTokens = await TokenModel.findOne({ refreshToken: oldRefreshToken })
      if (!userTokens) return null

      const tokens = this.generateToken({ id: userTokens.user })
      userTokens.refreshToken = tokens.refreshToken
      await userTokens.save()

      return tokens
    } catch (error) {
      console.error('Error in refreshToken:', error)
      return new Error(error)
    }
  }
}

module.exports = new TokenService()
