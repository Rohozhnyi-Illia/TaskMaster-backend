const express = require('express')
const AuthController = require('../controllers/AuthController')
const router = express.Router()

router.post('/register', (req, res) => {
  AuthController.register(req, res)
})

router.post('/verify-email', (req, res) => {
  AuthController.verifyEmail(req, res)
})

router.post('/login', (req, res) => {
  AuthController.login(req, res)
})

router.post('/update-password', (req, res) => {
  AuthController.updatePassword(req, res)
})

router.post('/verify-password', (req, res) => {
  AuthController.verifyPassword(req, res)
})

router.post('/logout', (req, res) => {
  AuthController.logout(req, res)
})

router.post('/refresh', (req, res) => {
  AuthController.refreshToken(req, res)
})

module.exports = router
