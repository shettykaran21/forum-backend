const { validationResult } = require('express-validator')

exports.loadAnswer = async (req, res, next, id) => {
  try {
    const answer = await req.question.answers.id(id)

    if (!answer) {
      const error = new Error('Answer not found')
      error.statusCode = 404
      throw error
    }

    req.answer = answer
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400
      err.message = 'Invalid answer id'
    }
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
  next()
}

exports.createAnswer = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed')
      error.statusCode = 422
      error.data = errors.array({ onlyFirstError: true })
      throw error
    }

    const { id } = req.user
    const { text } = req.body

    const question = await req.question.addAnswer(id, text)

    res
      .status(201)
      .json({ message: 'Answer posted successfully', data: question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deleteAnswer = async (req, res, next) => {
  try {
    const { answerId } = req.params
    const question = await req.question.removeAnswer(answerId)
    res.status(200).json({ message: 'Answer deleted', data: question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
