const Question = require('../models/question')

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Question.aggregate([
      { $project: { tags: 1 } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    res.status(200).json(tags)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
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
    res.status(200).json(tags)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
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

    res.status(200).json(tags)
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
