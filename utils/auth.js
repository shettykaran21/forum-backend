const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const config = require('../config')

const createToken = (user) => {
  if (!user.role) {
    throw new Error('User role is not specified')
  }

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry }
  )
}

const hashPassword = (password) => {
  const saltRounds = 10

  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        reject(err)
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err)
        }
        resolve(hash)
      })
    })
  })
}

module.exports = {
  hashPassword,
  createToken,
}
