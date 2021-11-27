const { body } = require('express-validator')

const validateAnswer = [
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

module.exports = validateAnswer
