const { body } = require('express-validator')

const validateUser = [
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

module.exports = validateUser
