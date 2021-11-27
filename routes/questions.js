const express = require('express')

const {
  getQuestions,
  createQuestion,
  getQuestion,
  loadQuestion,
} = require('../controllers/questions')
const { isAuth } = require('../middlewares/auth')
const validateQuestion = require('../middlewares/validation/validateQuestion')

const router = express.Router()

router.param('questionId', loadQuestion)

router.get('/', getQuestions)

router.post('/question', [isAuth, validateQuestion], createQuestion)

router.get('/question/:questionId', getQuestion)

module.exports = router
