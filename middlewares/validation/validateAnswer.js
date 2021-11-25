const { body } = require('express-validator');

exports.validateAnswer = [
  body('text')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 30 })
    .withMessage('must be at least 30 characters long')

    .isLength({ max: 30000 })
    .withMessage('must be at most 30000 characters long')
];
