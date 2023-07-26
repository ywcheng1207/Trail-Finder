const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userServices = {
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
      cb(null, { user: newUser })
      
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
