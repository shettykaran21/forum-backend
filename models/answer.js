const mongoose = require('mongoose')

const voteSchema = require('./vote')
const commentSchema = require('./comment')

const Schema = mongoose.Schema

const answerSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

answerSchema.set('toJSON', { getters: true })

answerSchema.methods = {
  addComment: function (author, body) {
    this.comments.push({ author, body })
    return this
  },
}

module.exports = answerSchema
