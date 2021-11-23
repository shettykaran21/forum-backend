const express = require('express')

const { signup, login, validateUser } = require('../controllers/auth')

const router = express.Router()

router.post('/signup', validateUser, signup)

router.post('/login', validateUser, login)

module.exports = router
