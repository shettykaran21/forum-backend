exports.upvote = async (req, res, next) => {
  const { id } = req.user

  if (req.params.answerId && req.params.commentId) {
    req.comment.vote(id, 1)
    const question = await req.question.save()
    return res.status(200).json({
      message: 'Comment upvoted successfully',
      data: question,
    })
  }

  if (req.params.answerId) {
    req.answer.vote(id, 1)
    const question = await req.question.save()

    return res.status(200).json({
      message: 'Answer upvoted successfully',
      data: question,
    })
  }

  const question = await req.question.vote(id, 1)
  return res
    .status(200)
    .json({ message: 'Question upvoted successfully', data: question })
}

exports.downvote = async (req, res, next) => {
  const { id } = req.user

  if (req.params.answerId && req.params.commentId) {
    req.comment.vote(id, -1)
    const question = await req.question.save()
    return res.status(200).json({
      message: 'Comment downvoted successfully',
      data: question,
    })
  }

  if (req.params.answerId) {
    req.answer.vote(id, -1)
    const question = await req.question.save()
    return res.status(200).json({
      message: 'Answer downvoted successfully',
      data: question,
    })
  }

  const question = await req.question.vote(id, -1)
  return res.status(200).json({
    message: 'Question downvoted successfully',
    data: question,
  })
}

exports.unvote = async (req, res, next) => {
  const { id } = req.user

  if (req.params.answerId && req.params.commentId) {
    req.comment.vote(id, 0)
    const question = await req.question.save()
    return res.status(200).json({
      message: 'Comment unvoted successfully',
      data: question,
    })
  }

  if (req.params.answerId) {
    req.answer.vote(id, 0)
    const question = await req.question.save()
    return res.status(200).json({
      message: 'Question unvoted successfully',
      data: question,
    })
  }

  const question = await req.question.vote(id, 0)
  return res
    .status(200)
    .json({ message: 'Question unvoted successfully', data: question })
}
