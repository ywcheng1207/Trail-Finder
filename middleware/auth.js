const passport = require('../config/passport')

const signInAuth = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (info) return res.status(401).json(info)
    req.user = user
    next()
  })(req, res, next)
}

const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({
      status: 'error',
      message: 'Not a valid account'
    })
  }
  next()
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Not a valid account'
    })
  }
  next()
}

module.exports = {
  signInAuth,
  isUser,
  isAdmin
}