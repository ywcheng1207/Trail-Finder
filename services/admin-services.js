const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const { User, Post, Favorite, Followship } = require('../models')

const adminServices = {
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
}

module.exports = adminServices
