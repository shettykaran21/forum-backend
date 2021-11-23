module.exports = {
  port: process.env.PORT || 8080,
  db: {
    url: process.env.MONGODB_DATABASE_URL || 'mongodb://localhost:27017/forum',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiry: '3d',
  },
}
