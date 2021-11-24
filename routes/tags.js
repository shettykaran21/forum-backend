const express = require('express')

const { getTags } = require('../controllers/tags')

const router = express.Router()

router.get('/', getTags)

module.exports = router
