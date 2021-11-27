const express = require('express')

const {
  getQuestions,
  createQuestion,
  getQuestion,
  loadQuestion,
  getQuestionsByUser,
} = require('../controllers/questions')
const { isAuth } = require('../middlewares/auth')
const { validateQuestion } = require('../middlewares/validaton')

const router = express.Router()

router.param('questionId', loadQuestion)

router.get('/', getQuestions)

router.post('/question', [isAuth, validateQuestion], createQuestion)

router.get('/question/:questionId', getQuestion)

router.get('/user/:username', getQuestionsByUser)

module.exports = router
