const express = require('express')

const { getUsers, getUser, searchUsers } = require('../controllers/users')

const router = express.Router()

router.get('/', getUsers)

router.get('/:searchUsername', searchUsers)

router.get('/user/:username', getUser)

module.exports = router
