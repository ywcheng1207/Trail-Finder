const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, cb) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return cb(null, false, { status: 401, message: '使用者不存在!' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return cb(null, false, { status: 401, message: '密碼不正確!' })
      }
      return cb(null, user)
    } catch (err) {
      return cb(err, false)
    }
  }
))

