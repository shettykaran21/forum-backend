const Question = require('../models/question')
const { handleServerError } = require('../utils/handleError')

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Question.aggregate([
      { $project: { tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    res.status(200).json({ message: 'Tags fetched successfully', data: tags })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.getPopularTags = async (req, res, next) => {
  try {
    const tags = await Question.aggregate([
      { $project: { tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 25 },
    ])
    res
      .status(200)
      .json({ message: 'Popular tags fetched successfully', data: tags })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}

exports.searchTags = async (req, res, next) => {
  const { searchTag } = req.params
  try {
    const tags = await Question.aggregate([
      { $project: { tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $match: { _id: { $regex: searchTag, $options: 'i' } } },
      { $sort: { count: -1 } },
    ])

    res.status(200).json({ message: 'Tags fetched successfully', data: tags })
  } catch (err) {
    handleServerError(err)
    next(err)
  }
}
