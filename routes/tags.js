const express = require('express')

const { getTags, getPopularTags, searchTags } = require('../controllers/tags')

const router = express.Router()

router.get('/', getTags)

router.get('/popular-tags', getPopularTags)

router.get('/:searchTag', searchTags)

module.exports = router
