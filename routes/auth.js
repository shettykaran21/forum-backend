const express = require('express')

const { signup, login } = require('../controllers/auth')
const { validateUser } = require('../middlewares/validaton')

const router = express.Router()

router.post('/signup', validateUser, signup)

router.post('/login', validateUser, login)

module.exports = router
