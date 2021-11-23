const User = require('../models/user')

exports.getUsers = async (req, res, next) => {
  try {
    const sortType = '-created'
    const users = await User.find().sort(sortType)
    res.status(200).json(users)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
      next(err)
    }
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ username: username })

    if (!user) {
      const error = new Error('Could not find user')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'User found', user })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
      next(err)
    }
  }
}
