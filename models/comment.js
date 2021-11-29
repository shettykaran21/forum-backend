const mongoose = require('mongoose')

const voteSchema = require('./vote')

const Schema = mongoose.Schema

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
    default: 0,
  },
  votes: [voteSchema],
})

commentSchema.set('toJSON', { getters: true })

commentSchema.methods = {
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

module.exports = commentSchema
