const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const userData = req.user
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  signUp: async (req, cb) => {
    try {
      const { name, email, password, passwordCheck } = req.body
      if (password != passwordCheck) {
        const err = new Error('Passwords do not match!')
        err.status = 404
        throw err
      }

      const user = await User.findOne({ where: { email: email } })
      if (user) {
        const err = new Error('Email already exists!')
        err.status = 404
        throw err
      }

      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name: name,
        email: email,
        password: hash
      })
      delete newUser.dataValues.password // 不確定有沒有更好移除密碼的方法，先湊合著用
      cb(null, { user: newUser })

    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
