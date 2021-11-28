const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const config = require('./config')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const questionRoutes = require('./routes/questions')
const tagRoutes = require('./routes/tags')
const answerRoutes = require('./routes/answers')
const commentRoutes = require('./routes/comments')
const voteRoutes = require('./routes/votes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/questions', questionRoutes)
app.use('/tags', tagRoutes)
app.use('/answers', answerRoutes)
app.use('/comments', commentRoutes)
app.use('/votes', voteRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message, data })
})

const connect = async () => {
  await mongoose.connect(config.db.url)
  console.log('Connected to MongoDB')
}

connect().catch((err) => console.log(err))

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
