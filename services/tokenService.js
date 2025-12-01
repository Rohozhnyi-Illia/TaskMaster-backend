const jwt = require('jsonwebtoken')
const TokenModel = require('../models/Token')
const bcrypt = require('bcrypt')

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
      const hashedToken = await bcrypt.hash(refreshToken, 10)

      const tokenData = await TokenModel.findOne({ user: userId })

      if (tokenData) {
        tokenData.refreshToken = hashedToken
        return tokenData.save()
      }

      return await TokenModel.create({
        user: userId,
        refreshToken: hashedToken,
      })
    } catch (error) {
      console.error('Error in saveToken:', error)
      return null
    }
  }

  async removeToken(userId) {
    try {
      return await TokenModel.deleteOne({ user: userId })
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

      const isValid = await bcrypt.compare(oldRefreshToken, tokenFromDB.refreshToken)
      if (!isValid) return null

      const tokens = this.generateToken({ id: userData.id })

      const hashedNew = await bcrypt.hash(tokens.refreshToken, 10)
      tokenFromDB.refreshToken = hashedNew
      await tokenFromDB.save()

      return tokens
    } catch (error) {
      console.error('Error in refreshToken:', error)
      return null
    }
  }
}

module.exports = new TokenService()
