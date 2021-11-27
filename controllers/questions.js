const { validationResult } = require('express-validator')

const Question = require('../models/question')
const User = require('../models/user')

exports.loadQuestion = async (req, res, next, id) => {
  try {
    const question = await Question.findById(id)

    if (!question) {
      const error = new Error('Question not found')
      error.statusCode = 404
      throw error
    }

    req.question = question
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400
      err.message = 'Invalid question id'
    }
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
  next()
}

exports.getQuestions = async (req, res, next) => {
  try {
    let sortType = '-score'
    let questions

    if (req.query.sort) {
      sortType = `-${req.query.sort}`
    }

    if (req.query.tag) {
      questions = await Question.find({ tags: { $all: req.query.tag } }).sort(
        sortType
      )
    } else {
      questions = await Question.find().sort(sortType)
    }

    res
      .status(200)
      .json({ message: 'Questions fetched successfully', data: questions })
  } catch (err) {
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
      error.data = errors.array({ onlyFirstError: true })
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
    res
      .status(201)
      .json({ message: 'Question posted successfully', data: question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getQuestion = async (req, res, next) => {
  const { questionId } = req.params

  try {
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('answers')

    if (!question) {
      const error = new Error('Could not find question')
      error.statusCode = 404
      throw error
    }

    res
      .status(200)
      .json({ message: 'Question fetched successfully', data: question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getQuestionsByUser = async (req, res, next) => {
  try {
    const { username } = req.params

    let sortType = '-created'
    if (req.query.sort) {
      sortType = `-${req.query.sort}`
    }

    const author = await User.findOne({ username })

    if (!author) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    const questions = await Question.find({ author: author.id }).sort(sortType)

    res.status(200).json({
      message: 'Questions by user fetched successfully',
      data: questions,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
