const { validationResult } = require('express-validator')

const Question = require('../models/question')
const User = require('../models/user')
const {
  handleCastError,
  handleServerError,
  createError,
} = require('../utils/handleError')

exports.loadQuestion = async (req, res, next, id) => {
  try {
    const question = await Question.findById(id)

    if (!question) {
      const error = createError('Question not found', 404)
      throw error
    }

    req.question = question
  } catch (err) {
    handleCastError(err, 'Invalid question id')
    handleServerError(err)
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
    handleServerError(err)
    next(err)
  }
}

exports.createQuestion = async (req, res, next) => {
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
    handleServerError(err)
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
      const error = createError('Could not find question', 404)
      throw error
    }

    res
      .status(200)
      .json({ message: 'Question fetched successfully', data: question })
  } catch (err) {
    handleServerError(err)
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
      const error = createError('User not found', 404)
      throw error
    }

    const questions = await Question.find({ author: author.id }).sort(sortType)

    res.status(200).json({
      message: 'Questions by user fetched successfully',
      data: questions,
    })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.deleteQuestion = async (req, res, next) => {
  try {
    await req.question.remove()
    res.status(200).json({ message: 'Question deleted successfully' })
  } catch (error) {
    handleServerError(err)
    next(err)
  }
}
