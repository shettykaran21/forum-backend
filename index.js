const express = require('express');

const PORT = 8080;

const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  res.status(200).json({message: 'Hello World'})
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})