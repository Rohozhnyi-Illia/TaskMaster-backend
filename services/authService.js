const UserModel = require('../models/User')
const TokenService = require('./tokenService')
const bcrypt = require('bcrypt')

class AuthService {
  async register(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Incomplete data')
      }

      const existingUser = await UserModel.findOne({ email })
      if (existingUser) {
        throw new Error('User already exists')
      }

      const hashPassword = await bcrypt.hash(password, 10)
      const newUser = await UserModel.create({ email, password: hashPassword })

      const tokens = TokenService.generateToken({ id: newUser._id })
      await TokenService.saveToken(newUser._id, tokens.refreshToken)

      return {
        id: newUser._id,
        email: newUser.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }
    } catch (error) {
      console.error('Error in register service:', error)
      throw error
    }
  }

  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Incomplete data')
      }

      const existingUser = await UserModel.findOne({ email })
      if (!existingUser) {
        throw new Error('User not found')
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password)
      if (!isPasswordValid) {
        throw new Error('Incorrect password')
      }

      const tokens = TokenService.generateToken({ id: existingUser._id })
      await TokenService.saveToken(existingUser._id, tokens.refreshToken)

      return {
        id: existingUser._id,
        email: existingUser.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }
    } catch (error) {
      console.error('Error in login service:', error)
      throw error
    }
  }

  async updatePassword(email, newPassword, repeatPassword) {
    try {
      const existingUser = await UserModel.findOne({ email })
      if (!existingUser) {
        throw new Error('User not found')
      }

      if (newPassword !== repeatPassword) {
        throw new Error('Passwords do not match')
      }

      const hashPassword = await bcrypt.hash(newPassword, 10)
      existingUser.password = hashPassword
      await existingUser.save()

      return { message: 'Password updated successfully' }
    } catch (error) {
      console.error('Error in updatePassword service:', error)
      throw error
    }
  }

  async logout(refreshToken) {
    try {
      if (!refreshToken) return Error('No token provided')
      await TokenService.removeToken(refreshToken)

      return { message: 'Successfully logged out' }
    } catch (error) {
      console.error('Error in logout service:', error)
      throw new Error(error)
    }
  }

  async refreshToken(refreshToken) {
    try {
      const updatedTokens = await TokenService.refreshToken(refreshToken)
      if (!updatedTokens) {
        return Error('Token update error')
      }

      return updatedTokens
    } catch (error) {
      console.error('Error in refreshToken service:', error)
      throw error
    }
  }
}

module.exports = new AuthService()
