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

  removeComment: function (id) {
    const comment = this.comments.id(id)

    if (!comment) {
      const error = new Error('Comment not found')
      error.statusCode = 404
      throw error
    }

    comment.remove()
    return this
  },

  vote: function (userId, vote) {
    const existingVote = this.votes.find((vote) => vote.user._id.equals(userId))

    if (!existingVote && vote !== 0) {
      this.score += vote
      this.votes.push({ user: userId, vote })
    }

    if (existingVote) {
      this.score -= existingVote.vote

      if (vote === 0) {
        this.votes.pull(existingVote)
      } else {
        this.score += vote
        existingVote.vote = vote
      }
    }
    return this
  },
}

module.exports = answerSchema
