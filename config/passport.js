const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
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
      return cb(null, user.get())
    } catch (err) {
      return cb(err, false)
    }
  }
))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, cb) => {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ where: { email } })
      if (user) return cb(null, user.toJSON())
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      const newUser = await User.create({
        name,
        email,
        password: hash,
        role: 'user'
      })
      cb(null, newUser.toJSON())
    } catch (err) {
      cb(err)
    }
  }
))

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
  try {
    const user = User.findByPk(jwtPayload.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    if (!user) return cb(null, false)
    return cb(null, user)
  } catch (err) {
    cb(err)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    cb(null, user.toJSON())
  } catch (err) {
    cb(err)
  }
})

module.exports = passport
