const mongoose = require('mongoose')

const voteSchema = require('./vote')
const commentSchema = require('./comment')
const answerSchema = require('./answer')

const Schema = mongoose.Schema

const questionSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  votes: [voteSchema],
  comments: [commentSchema],
  answers: [answerSchema],
})

questionSchema.set('toJSON', { getters: true })

questionSchema.options.toJSON.transform = (doc, ret, options) => {
  const obj = { ...ret }
  delete obj._id
  delete obj.__v
  return obj
}

module.exports = mongoose.model('Question', questionSchema)
