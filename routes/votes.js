const express = require('express')

const { upvote, downvote, unvote } = require('../controllers/votes')
const { isAuth } = require('../middlewares/auth')
const { loadQuestion } = require('../controllers/questions')

const router = express.Router()

router.param('questionId', loadQuestion)

router.put('/upvote/:questionId', isAuth, upvote)
router.put('/downvote/:questionId', isAuth, downvote)
router.put('/unvote/:questionId', isAuth, unvote)

module.exports = router
