const express = require('express')

const { getUsers, getUser } = require('../controllers/users')

const router = express.Router()

router.get('/', getUsers)

router.get('/:username', getUser)

module.exports = router
