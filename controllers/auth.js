const { validationResult } = require('express-validator')
const jwtDecode = require('jwt-decode')

const { createToken, hashPassword, verifyPassword } = require('../utils/auth')
const User = require('../models/user')
const { handleServerError, createError } = require('../utils/handleError')

exports.signup = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = createError(
        'Validation failed',
        422,
        errors.array({ onlyFirstError: true })
      )
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
      const error = createError('This username already exists', 400)
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
      const error = createError(
        'Some error occurred while creating your account',
        400
      )
      throw error
    }
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = createError(
        'Validation failed',
        422,
        errors.array({ onlyFirstError: true })
      )
      throw error
    }

    const { username, password } = req.body
    const user = await User.findOne({
      username: username.toLowerCase(),
    })

    if (!user) {
      const error = createError('Username not found', 401)
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
      const error = createError('Incorrect password', 401)
      throw error
    }
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}
