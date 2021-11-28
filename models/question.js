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
  delete ret.id
  delete ret.__v
  return ret
}

questionSchema.methods = {
  addAnswer: function (author, text) {
    this.answers.push({ author, text })
    return this.save()
  },

  removeAnswer: function (id) {
    const answer = this.answers.id(id)

    if (!answer) {
      const error = new Error('Answer not found')
      error.statusCode = 404
      throw error
    }

    answer.remove()
    return this.save()
  },

  addComment: function (author, body) {
    this.comments.push({ author, body })
    return this.save()
  },

  removeComment: function (id) {
    const comment = this.comments.id(id)

    if (!comment) {
      const error = new Error('Comment not found')
      error.statusCode = 404
      throw error
    }

    comment.remove()
    return this.save()
  },

  vote: function (userId, vote) {
    const existingVote = this.votes.find((vote) => vote.user._id.equals(userId))

    if (!existingVote && vote !== 0) {
      // New vote
      this.score += vote
      this.votes.push({ user: userId, vote })
    }

    if (existingVote) {
      // Reset score
      this.score -= existingVote.vote

      // Remove vote
      // Eg. If user has upvoted, and user wants to remove upvote
      if (vote === 0) {
        this.votes.pull(existingVote)
      } else {
        // Change vote
        // Eg. If user has upvoted, and user wants to downvote or vice-versa
        this.score += vote
        existingVote.vote = vote
      }
    }

    return this.save()
  },
}

questionSchema.pre(/^find/, function () {
  this.populate('author')
    .populate('answers.author', '-role')
    .populate('comments.author', '-role')
    .populate('answers.comments.author', '-role')
})

questionSchema.post('save', async function (doc, next) {
  await doc.populate('author')
  await doc.populate('answers.author', '-role')
  await doc.populate('comments.author', '-role')
  await doc.populate('answers.comments.author', '-role')
  next()
})

module.exports = mongoose.model('Question', questionSchema)
