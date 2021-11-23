const express = require('express')

const { getQuestions, createQuestion } = require('../controllers/questions')
const isAuth = require('../middlewares/isAuth')

const router = express.Router()

router.get('/', getQuestions)

router.post('/question', isAuth, createQuestion)

module.exports = router
