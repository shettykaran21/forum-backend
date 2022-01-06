const { body } = require('express-validator')

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

exports.validateQuestion = [
  body('title')
    .exists()
    .trim()
    .withMessage('Title is required')

    .notEmpty()
    .withMessage('Title cannot be blank')

    .isLength({ min: 10 })
    .withMessage('Title must be at lease 10 characters long')

    .isLength({ max: 180 })
    .withMessage('Title must be at most 180 characters long'),

  body('text')
    .exists()
    .trim()
    .withMessage('Text is required')

    .isLength({ min: 20 })
    .withMessage('Text must be at least 20 characters long')

    .isLength({ max: 20000 })
    .withMessage('Text must be at most 20000 characters long'),

  body('tags').exists().withMessage('is required'),
]

exports.validateAnswer = [
  body('text')
    .exists()
    .trim()
    .withMessage('Answer is required')

    .notEmpty()
    .withMessage('Answer cannot be blank')

    .isLength({ min: 25 })
    .withMessage('Answer must be at least 30 characters long')

    .isLength({ max: 30000 })
    .withMessage('Answer must be at most 30000 characters long'),
]

exports.validateComment = [
  body('text')
    .exists()
    .trim()
    .withMessage('Comment is required')

    .notEmpty()
    .withMessage('Comment cannot be blank')

    .isLength({ max: 1000 })
    .withMessage('Comment must be at most 1000 characters long'),
]
