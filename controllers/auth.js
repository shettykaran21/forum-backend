const { validationResult } = require('express-validator')
const jwtDecode = require('jwt-decode')

const { createToken, hashPassword } = require('../utils/auth')
const User = require('../models/user')

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }

  try {
    const { username, password } = req.body

    const hashedPassword = await hashPassword(password)

    const userData = {
      username: username.toLowerCase(),
      password: hashedPassword,
    }

    const existingUsername = await User.findOne({
      username: userData.username,
    })

    if (existingUsername) {
      return res.status(400).json({
        message: 'This username already exists.',
      })
    }

    const user = new User(userData)
    const savedUser = await user.save()

    if (savedUser) {
      const token = createToken(savedUser)
      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp

      const { username, role, id, created, profilePhoto } = savedUser
      const userInfo = {
        username,
        role,
        id,
        created,
        profilePhoto,
      }

      return res.status(201).json({
        message: 'User created',
        token,
        userInfo,
        expiresAt,
      })
    } else {
      return res.status(400).json({
        message: 'Some error occurred while creating your account',
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
