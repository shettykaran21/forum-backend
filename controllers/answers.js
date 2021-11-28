const { validationResult } = require('express-validator')

const {
  handleServerError,
  handleCastError,
  createError,
} = require('../utils/handleError')

exports.loadAnswer = async (req, res, next, id) => {
  try {
    const answer = await req.question.answers.id(id)

    if (!answer) {
      const error = createError('Answer not found', 404)
      throw error
    }

    req.answer = answer
  } catch (err) {
    handleCastError(err)
    handleServerError(err)
    next(err)
  }
  next()
}

exports.createAnswer = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = createError(
        'Validation failed',
        422,
        errors.array({ onlyFirstError: true })
      )
      throw error
    }

    const { id } = req.user
    const { text } = req.body

    const question = await req.question.addAnswer(id, text)

    res
      .status(201)
      .json({ message: 'Answer posted successfully', data: question })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.deleteAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params
    const question = await req.question.removeAnswer(answerId)
    res
      .status(200)
      .json({ message: 'Answer deleted successfully', data: question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
