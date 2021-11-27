const express = require('express')

const { createAnswer } = require('../controllers/answers')
const { loadQuestion } = require('../controllers/questions')
const isAuth = require('../middlewares/isAuth')
const validateAnswer = require('../middlewares/validation/validateAnswer')

const router = express.Router()

router.param('questionId', loadQuestion)

router.post('/:questionId', [isAuth, validateAnswer], createAnswer)

module.exports = router
