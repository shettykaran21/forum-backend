const { validationResult } = require('express-validator')

const Question = require('../models/question')

exports.createAnswer = async (req, res, next) => {
  const errors = validationResult(req)

  const questionId = req.params.questionId

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed')
      error.statusCode = 422
      error.data = errors.array({ onlyFirstError: true })
      throw error
    }

    const { id } = req.user
    const { text } = req.body

    const question = await Question.findById(questionId)
    // await question.addAnswer(id, text)

    res.status(201).json({ message: 'Answer posted successfully' })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
