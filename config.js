module.exports = {
  port: process.env.PORT || 8080,
  db: {
    url:
      process.env.MONGODB_PROD_DATABASE_URI ||
      process.env.MONGODB_DEV_DATABASE_URI ||
      'mongodb://localhost:27017/forum',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiry: '3d',
  },
}
