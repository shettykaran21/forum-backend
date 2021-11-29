const express = require('express')

const { upvote, downvote, unvote } = require('../controllers/votes')
const { isAuth } = require('../middlewares/auth')
const { loadQuestion } = require('../controllers/questions')
const { loadAnswer } = require('../controllers/answers')
const { loadComment } = require('../controllers/comments')

const router = express.Router()

router.param('questionId', loadQuestion)

router.param('answerId', loadAnswer)

router.param('commentId', loadComment)

router.put('/upvote/:questionId', isAuth, upvote)
router.put('/downvote/:questionId', isAuth, downvote)
router.put('/unvote/:questionId', isAuth, unvote)

router.put('/upvote/:questionId/:answerId', isAuth, upvote)
router.put('/downvote/:questionId/:answerId', isAuth, downvote)
router.put('/unvote/:questionId/:answerId', isAuth, unvote)

router.put('/upvote/:questionId/:answerId/:commentId', isAuth, upvote)
router.put('/downvote/:questionId/:answerId/:commentId', isAuth, downvote)
router.put('/unvote/:questionId/:answerId/:commentId', isAuth, unvote)

module.exports = router
