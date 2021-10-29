const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const questionRoutes = require('./routes/questions')
const userRoutes = require('./routes/users')

const PORT = 8080

const app = express()

app.use(cors())
app.use(express.json())

app.use('/questions', questionRoutes)
app.use('/users', userRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message, data })
})

const connect = async () => {
  await mongoose.connect(
    'mongodb+srv://shettykaran21:QzwobCNMJ06fbxgf@cluster0.qkxzl.mongodb.net/forum?retryWrites=true&w=majority'
  )
  console.log('Connected to MongoDB')
}

connect().catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
