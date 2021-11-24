const express = require('express')

const { getTags, getPopularTags } = require('../controllers/tags')

const router = express.Router()

router.get('/', getTags)

router.get('/popular-tags', getPopularTags)

module.exports = router
