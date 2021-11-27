const express = require('express')

const { createAnswer } = require('../controllers/answers')
const isAuth = require('../middlewares/isAuth')
const validateAnswer = require('../middlewares/validation/validateAnswer')

const router = express.Router()

router.post('/:questionId', [isAuth], createAnswer)

module.exports = router
