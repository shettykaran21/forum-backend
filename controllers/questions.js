const { validationResult } = require('express-validator')

const Question = require('../models/question')

exports.loadQuestion = async (req, res, next, id) => {
  try {
    let question
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      question = await Question.findById(id)
    }

    if (!question)
      return res.status(404).json({ message: 'Question not found.' })

    console.log(question)

    req.question = question
  } catch (error) {
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
      .json({ message: 'Questions fetched successfully', questions })
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

    res.status(200).json(question)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
