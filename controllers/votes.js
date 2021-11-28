exports.upvote = async (req, res, next) => {
  const { id } = req.user

  const question = await req.question.vote(id, 1)
  return res
    .status(200)
    .json({ message: 'Question upvoted successfully', data: question })
}

exports.downvote = async (req, res, next) => {
  const { id } = req.user

  const question = await req.question.vote(id, -1)
  return res.json({
    message: 'Question downvoted successfully',
    data: question,
  })
}

exports.unvote = async (req, res, next) => {
  const { id } = req.user

  const question = await req.question.vote(id, 0)
  return res.json({ message: 'Question unvoted successfully', data: question })
}
