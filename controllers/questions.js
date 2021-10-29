const Question = require('../models/question')

exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find()
    res.status(200).json(questions)
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500
      next(err)
    }
  }
}
