const mongoose = require('mongoose')

const voteSchema = require('./vote')
const commentSchema = require('./comment')

const Schema = mongoose.Schema

const answerSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  text: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  votes: [voteSchema],
  comments: [commentSchema],
})

module.exports = answerSchema
