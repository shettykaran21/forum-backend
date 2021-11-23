const jwt = require('jsonwebtoken')
const config = require('../config')

const isAuth = (req, res, next) => {
  const authHeader = req.get('Authorization')

  try {
    if (!authHeader) {
      const error = new Error('Not Authenticated')
      error.statusCode = 401
      throw error
    }
    const token = authHeader.split(' ')[1]

    const decodedToken = jwt.verify(token, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    })

    if (!decodedToken) {
      const error = new Error('Not Authenticated')
      error.statusCode = 401
      throw error
    }

    req.user = decodedToken
    next()
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    })
  }
}

module.exports = isAuth