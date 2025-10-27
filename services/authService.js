const UserModel = require('../models/User')
const TokenService = require('./tokenService')
const bcrypt = require('bcrypt')
const MailService = require('./mailService')
const createVerifyCode = require('../helpers/createVerifyCode')

class AuthService {
  async register(email, password, name) {
    try {
      if (!email || !password || !name) {
        throw new Error('Incomplete data')
      }

      const existingUser = await UserModel.findOne({ email })
      if (existingUser) {
        throw new Error('User already exists')
      }

      const hashPassword = await bcrypt.hash(password, 10)
      const newUser = await UserModel.create({ email, password: hashPassword, name })

      const code = createVerifyCode()
      await MailService.sendMail(email, 'Email verification', code)
      newUser.emailActivationCode = code
      newUser.emailActivationCodeLifetime = new Date(Date.now() + 10 * 60 * 1000)
      await newUser.save()

      return {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        message: 'User registered. Please verify your email using the code sent to your inbox',
      }
    } catch (error) {
      console.error('Error in register service:', error)
      throw error
    }
  }

  async verifyEmail(email, verifyCode) {
    try {
      const existingUser = await UserModel.findOne({ email })
      if (!existingUser) {
        throw new Error('User not found')
      }

      if (verifyCode !== existingUser.emailActivationCode) {
        throw new Error('Incorrect verification code')
      }

      const isCodeValid = new Date() < existingUser.emailActivationCodeLifetime
      if (!isCodeValid) {
        throw new Error('The code is no longer valid.')
      }

      existingUser.emailActivated = true
      existingUser.emailActivationCode = null
      existingUser.emailActivationCodeLifetime = null

      const tokens = TokenService.generateToken({ id: existingUser._id })
      await TokenService.saveToken(existingUser._id, tokens.refreshToken)
      await existingUser.save()

      return {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        message: 'User registered. Please verify your email using the code sent to your inbox',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      }
    } catch (error) {
      console.error('Error in verify email service:', error)
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

      if (!existingUser.emailActivated) {
        throw new Error('Email not activated')
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
        name: existingUser.name,
      }
    } catch (error) {
      console.error('Error in login service:', error)
      throw error
    }
  }

  async updatePassword(email) {
    try {
      const existingUser = await UserModel.findOne({ email })
      if (!existingUser) {
        throw new Error('User not found')
      }

      const code = createVerifyCode()

      existingUser.passwordResetCode = code
      existingUser.passwordResetCodeLifetime = new Date(Date.now() + 10 * 60 * 1000)

      await MailService.sendMail(email, 'password verification', code)

      await existingUser.save()
      return { message: 'The operation was successful' }
    } catch (error) {
      console.error('Error in updatePassword service:', error)
      throw error
    }
  }

  async verifyPassword(email, verifyCode, newPassword, repeatPassword) {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) {
        throw new Error('User not found')
      }

      if (newPassword !== repeatPassword) {
        throw new Error('Passwords do not match')
      }

      const isPasswordsMatch = await bcrypt.compare(newPassword, user.password)
      if (isPasswordsMatch) {
        throw new Error('This password is already in use')
      }

      if (verifyCode !== user.passwordResetCode) {
        throw new Error('Incorrect verification code')
      }

      const isCodeValid = new Date() < user.passwordResetCodeLifetime
      if (!isCodeValid) {
        throw new Error('The code is no longer valid.')
      }

      const hashPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashPassword
      user.passwordResetCode = null
      user.passwordResetCodeLifetime = null
      await user.save()

      return { message: 'Password successfully changed' }
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
