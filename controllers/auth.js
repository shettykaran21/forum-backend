const { body, validationResult } = require('express-validator')
const jwtDecode = require('jwt-decode')

const { createToken, hashPassword, verifyPassword } = require('../utils/auth')
const User = require('../models/user')

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

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
      const error = new Error('This username already exists')
      error.statusCode = 400
      throw error
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
      const error = new Error('Some error occurred while creating your account')
      error.statusCode = 400
      throw error
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }

    const { username, password } = req.body
    const user = await User.findOne({
      username: username.toLowerCase(),
    })

    if (!user) {
      const error = new Error('Username not found')
      error.statusCode = 401
      throw error
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (isPasswordValid) {
      const token = createToken(user)
      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp

      const { username, role, id, created, profilePhoto } = user
      const userInfo = { username, role, id, created, profilePhoto }

      res.status(200).json({
        message: 'Logged in successfully',
        token,
        userInfo,
        expiresAt,
      })
    } else {
      const error = new Error('Incorrect password')
      error.statusCode = 401
      throw error
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.validateUser = [
  body('username')
    .exists()
    .trim()
    .withMessage('Username is required')

    .notEmpty()
    .withMessage('Username cannot be empty')

    .isLength({ max: 16 })
    .withMessage('Username must be at most 16 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username contains invalid characters'),

  body('password')
    .exists()
    .trim()
    .withMessage('Password is required')

    .notEmpty()
    .withMessage('Password cannot be empty')

    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')

    .isLength({ max: 20 })
    .withMessage('Password must be at most 20 characters long'),
]
