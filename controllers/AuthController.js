const AuthService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const result = await AuthService.register(email, password, name);

      res.status(200).json({
        success: true,
        data: {
          id: result.id,
          email: result.email,
          name: result.name,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { email, verifyCode } = req.body;
      const result = await AuthService.verifyEmail(email, verifyCode);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: {
          id: result.id,
          email: result.email,
          name: result.name,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async reVerifyEmail(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.reVerifyEmail(email);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: {
          id: result.id,
          email: result.email,
          accessToken: result.accessToken,
          name: result.name,
          emailActivated: result.emailActivated,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.updatePassword(email);

      return res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async verifyPassword(req, res) {
    try {
      const { email, verifyCode, newPassword, repeatPassword } = req.body;
      const result = await AuthService.verifyPassword(
        email,
        verifyCode,
        newPassword,
        repeatPassword,
      );

      return res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  async logout(req, res) {
    try {
      const { refreshToken } = req.cookies;

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',

        path: '/',
      });

      return res.json({ success: true, message: 'Logged out' });
    } catch (error) {
      return res.json({ success: false, error: error.message || 'Logout error' });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      const result = await AuthService.refreshToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({ success: true, data: result.accessToken });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
}

module.exports = new AuthController();
