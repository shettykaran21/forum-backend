const express = require('express')

const { createComment } = require('../controllers/comments')
const { loadQuestion } = require('../controllers/questions')
const { isAuth } = require('../middlewares/auth')
const { validateComment } = require('../middlewares/validaton')

const router = express.Router()

router.param('questionId', loadQuestion)

router.post('/:questionId', [isAuth, validateComment], createComment)

module.exports = router
