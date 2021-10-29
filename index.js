const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const PORT = 8080

const app = express()

app.use(cors())
app.use(express.json())

const connect = async () => {
  await mongoose.connect(
    'mongodb+srv://shettykaran21:gL1UEVxOEHQYIig7@cluster0.qkxzl.mongodb.net/forum?retryWrites=true&w=majority'
  )
  console.log('Connected to MongoDB')
}

connect().catch((err) => console.log(err))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
