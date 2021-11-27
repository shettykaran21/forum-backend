const { validationResult } = require('express-validator')

exports.loadComment = async (req, res, next, id) => {
  try {
    const comment = await req.question.comments.id(id)

    if (!comment) {
      const error = new Error('Comment not found')
      error.statusCode = 404
      throw error
    }

    req.comment = comment
  } catch (err) {
    if (err.name === 'CastError') {
      err.statusCode = 400
      err.message = 'Invalid comment id'
    }
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
  next()
}

exports.createComment = async (req, res, next) => {
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

    const question = await req.question.addComment(id, text)
    res
      .status(201)
      .json({ message: 'Comment posted successfully', data: question })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
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
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
