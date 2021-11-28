const express = require('express')

const {
  createComment,
  loadComment,
  deleteComment,
  createAnswerComment,
} = require('../controllers/comments')
const { loadQuestion } = require('../controllers/questions')
const { loadAnswer } = require('../controllers/answers')
const { isAuth, commentAuth } = require('../middlewares/auth')
const { validateComment } = require('../middlewares/validaton')

const router = express.Router()

router.param('questionId', loadQuestion)

router.param('commentId', loadComment)

router.param('answerId', loadAnswer)

router.post('/:questionId', [isAuth, validateComment], createComment)

router.post(
  '/:questionId/:answerId',
  [isAuth, validateComment],
  createAnswerComment
)

router.delete('/:questionId/:commentId', [isAuth, commentAuth], deleteComment)

module.exports = router
