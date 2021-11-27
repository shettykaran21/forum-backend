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
}

questionSchema.pre(/^find/, function () {
  this.populate('author')
    .populate('answers.author', '-role')
    .populate('comments.author', '-role')
})

questionSchema.pre('save', function (next) {
  this.wasNew = this.isNew
  next()
})

questionSchema.post('save', async function (doc, next) {
  await doc.populate('author')
  await doc.populate('answers.author', '-role')
  await doc.populate('comments.author', '-role')
  next()
})

module.exports = mongoose.model('Question', questionSchema)
