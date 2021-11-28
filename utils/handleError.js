exports.handleServerError = (err) => {
  if (!err.statusCode) {
    err.statusCode = 500
  }
}

exports.handleCastError = (err, msg) => {
  if (err.name === 'CastError') {
    err.statusCode = 400
    err.message = msg
  }
}

exports.createError = (msg, statusCode, data) => {
  const error = new Error(msg)
  error.statusCode = statusCode
  error.data = data
  return error
}
