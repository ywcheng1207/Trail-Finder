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

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    /** passport.js 中的 passport.use(new JWTStrategy(...)) 如果用 async/await 風格寫
      * cb 裡的 user 會變成 promise 格式，要將 user 的值取出需要用非同步的方式取
      */
    req.user = await user
    next()
  })(req, res, next)
}

const optionalAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (user) req.user = await user
    next()
  })(req, res, next)
}

module.exports = {
  signInAuth,
  isUser,
  isAdmin,
  authenticated,
  optionalAuthenticated
}