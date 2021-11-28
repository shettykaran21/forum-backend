const User = require('../models/user')
const { handleServerError, createError } = require('../utils/handleError')

exports.getUsers = async (req, res, next) => {
  try {
    const sortType = '-created'
    const users = await User.find().sort(sortType)
    res.status(200).json({ message: 'Users fetched successfully', data: users })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ username })

    if (!user) {
      const error = createError('Could not find user', 404)
      throw error
    }

    res.status(200).json({ message: 'User found', data: user })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.searchUsers = async (req, res, next) => {
  try {
    const { searchUsername } = req.params

    const users = await User.find({
      username: { $regex: searchUsername, $options: 'i' },
    })

    res.status(200).json({ message: 'Users fetched successfully', data: users })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}
