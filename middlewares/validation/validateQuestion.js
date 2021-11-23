const { body } = require('express-validator')

const validateQuestion = [
  body('title')
    .exists()
    .trim()
    .withMessage('Title is required')

    .notEmpty()
    .withMessage('Title cannot be blank')

    .isLength({ max: 180 })
    .withMessage('Title must be at most 180 characters long'),

  body('text')
    .exists()
    .trim()
    .withMessage('Text is required')

    .isLength({ min: 10 })
    .withMessage('Text must be at least 10 characters long')

    .isLength({ max: 5000 })
    .withMessage('Text must be at most 5000 characters long'),

  body('tags').exists().withMessage('is required'),
]

module.exports = validateQuestion
