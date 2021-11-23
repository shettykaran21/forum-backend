const { validationResult } = require('express-validator')

const Question = require('../models/question')

exports.getQuestions = async (req, res, next) => {
  try {
    const { sortType = '-score' } = req.body
    const questions = await Question.find().sort(sortType)
    res.status(200).json(questions)
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.createQuestion = async (req, res, next) => {
  const errors = validationResult(req)

  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed')
      error.statusCode = 422
      throw error
    }

    const { title, tags, text } = req.body
    const author = req.user.id
    const question = await Question.create({
      title,
      author,
      tags,
      text,
    })
    res.status(201).json({ message: 'Question posted successfully', question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
