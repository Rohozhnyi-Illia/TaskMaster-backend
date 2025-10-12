const jwt = require('jsonwebtoken')
const UserModel = require('../models/User.js')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Token missing' })
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    if (!payload) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    const user = await UserModel.findById(payload.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Error in authMiddleware:', error)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = authMiddleware
