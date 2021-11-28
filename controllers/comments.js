const { validationResult } = require('express-validator')

const {
  handleServerError,
  createError,
  handleCastError,
} = require('../utils/handleError')

exports.loadComment = async (req, res, next, id) => {
  try {
    let comment
    if (req.answer) {
      comment = await req.answer.comments.id(id)
    } else {
      comment = await req.question.comments.id(id)
    }

    if (!comment) {
      const error = createError('Comment not found', 404)
      throw error
    }

    req.comment = comment
  } catch (err) {
    handleCastError(err, 'Invalid comment id')
    handleServerError(err)
    next(err)
  }
  next()
}

exports.createComment = async (req, res, next) => {
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

    const question = await req.question.addComment(id, text)
    res
      .status(201)
      .json({ message: 'Comment posted successfully', data: question })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params
    const question = await req.question.removeComment(commentId)
    return res
      .status(200)
      .json({ message: 'Comment deleted successfully', data: question })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.createAnswerComment = async (req, res, next) => {
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

    req.answer.addComment(id, text)
    const question = await req.question.save()

    res
      .status(201)
      .json({ message: 'Comment posted successfully', data: question })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.deleteAnswerComment = async (req, res, next) => {
  const { commentId } = req.params

  try {
    req.answer.removeComment(commentId)
    const question = await req.question.save()
    return res
      .status(200)
      .json({ message: 'Comment deleted successfully', data: question })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}
