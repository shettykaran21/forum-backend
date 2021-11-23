const express = require('express')

const {
  getQuestions,
  createQuestion,
  getQuestion,
} = require('../controllers/questions')
const isAuth = require('../middlewares/isAuth')
const validateQuestion = require('../middlewares/validation/validateQuestion')

const router = express.Router()

router.get('/', getQuestions)

router.post('/question', [isAuth, validateQuestion], createQuestion)

router.get('/question/:questionId', getQuestion)

module.exports = router
