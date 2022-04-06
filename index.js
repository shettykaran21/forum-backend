const path = require('path')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const config = require('./config')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const questionRoutes = require('./routes/questions')
const tagRoutes = require('./routes/tags')
const answerRoutes = require('./routes/answers')
const commentRoutes = require('./routes/comments')
const voteRoutes = require('./routes/votes')

const app = express()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4())
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(cors())
app.use(express.json())

app.use(multer({ storage, fileFilter }).single('image'))

app.use('/images', express.static(path.join(__dirname, 'images')))

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
  try {
    await mongoose.connect(config.db.url)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
  }
}

connect()

app.use(express.static(path.resolve(__dirname, '../client/.next/server/pages')))
app.get('*', function (req, res) {
  res.sendFile(
    path.resolve(__dirname, '../client/.next/server/pages', 'index.html')
  )
})

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})
