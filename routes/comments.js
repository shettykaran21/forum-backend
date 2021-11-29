const express = require('express')

const {
  createComment,
  loadComment,
  deleteComment,
  createAnswerComment,
  deleteAnswerComment,
} = require('../controllers/comments')
const { loadQuestion } = require('../controllers/questions')
const { loadAnswer } = require('../controllers/answers')
const { isAuth, commentAuth } = require('../middlewares/auth')
const { validateComment } = require('../middlewares/validaton')

const router = express.Router()

router.param('questionId', loadQuestion)

router.param('answerId', loadAnswer)

router.param('commentId', loadComment)

router.post('/:questionId/:answerId?', [isAuth, validateComment], createComment)

router.delete('/:questionId/:commentId', [isAuth, commentAuth], deleteComment)

router.delete(
  '/:questionId/:answerId/:commentId',
  [isAuth, commentAuth],
  deleteAnswerComment
)

module.exports = router
