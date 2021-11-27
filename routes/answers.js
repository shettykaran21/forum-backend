const express = require('express')

const {
  createAnswer,
  deleteAnswer,
  loadAnswer,
} = require('../controllers/answers')
const { loadQuestion } = require('../controllers/questions')
const { isAuth, answerAuth } = require('../middlewares/auth')
const validateAnswer = require('../middlewares/validation/validateAnswer')

const router = express.Router()

router.param('questionId', loadQuestion)

router.param('answerId', loadAnswer)

router.post('/:questionId', [isAuth, validateAnswer], createAnswer)

router.delete('/:questionId/:answerId', [isAuth, answerAuth], deleteAnswer)

module.exports = router
