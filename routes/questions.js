const express = require('express')

const { getQuestions } = require('../controllers/questions')

const router = express.Router()

router.get('/', getQuestions)

module.exports = router
