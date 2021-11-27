const express = require('express')

const {
  createComment,
  loadComment,
  deleteComment,
} = require('../controllers/comments')
const { loadQuestion } = require('../controllers/questions')
const { isAuth, commentAuth } = require('../middlewares/auth')
const { validateComment } = require('../middlewares/validaton')

const router = express.Router()

router.param('questionId', loadQuestion)

router.param('commentId', loadComment)

router.post('/:questionId', [isAuth, validateComment], createComment)

router.delete('/:questionId/:commentId', [isAuth, commentAuth], deleteComment)

module.exports = router
