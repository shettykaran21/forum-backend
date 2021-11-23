const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  profilePhoto: {
    type: String,
    default: () => 'https://imgur.com/FQOda9L',
  },
  created: {
    type: Date,
    default: Date.now,
  },
})

userSchema.set('toJSON', { getters: true })

userSchema.options.toJSON.transform = (doc, ret) => {
  delete ret.password
  delete ret.id
  delete ret.__v
  return ret
}

module.exports = mongoose.model('User', userSchema)
