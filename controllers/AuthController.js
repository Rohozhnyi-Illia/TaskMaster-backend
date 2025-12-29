const AuthService = require('../services/authService')

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name } = req.body
      const result = await AuthService.register(email, password, name)

      res.status(200).json({
        id: result.id,
        email: result.email,
        name: result.name,
        message: result.message,
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async verifyEmail(req, res) {
    try {
      const { email, verifyCode } = req.body
      const result = await AuthService.verifyEmail(email, verifyCode)

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async reVerifyEmail(req, res) {
    try {
      const { email } = req.body
      const result = await AuthService.reVerifyEmail(email)

      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const result = await AuthService.login(email, password)

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(200).json({
        id: result.id,
        email: result.email,
        accessToken: result.accessToken,
        name: result.name,
        emailActivated: result.emailActivated,
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async updatePassword(req, res) {
    try {
      const { email } = req.body
      const result = await AuthService.updatePassword(email)

      return res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async verifyPassword(req, res) {
    try {
      const { email, verifyCode, newPassword, repeatPassword } = req.body
      const result = await AuthService.verifyPassword(
        email,
        verifyCode,
        newPassword,
        repeatPassword
      )

      return res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies
      const result = await AuthService.logout(refreshToken)

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined,
        path: '/',
      })

      return res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies
      const result = await AuthService.refreshToken(refreshToken)

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      return res.json(result)
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }
}

module.exports = new AuthController()
