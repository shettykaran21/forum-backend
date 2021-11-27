exports.createComment = async (req, res, next) => {
  const { id } = req.user
  const { text } = req.body

  try {
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
