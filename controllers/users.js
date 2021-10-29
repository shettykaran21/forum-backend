const User = require('../models/user')

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500
      next(err)
    }
  }
}
