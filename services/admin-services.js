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
  getAllUsers: async (req, cb) => {
    try {
      const allUsers = await User.findAll({
        attributes: [
          'id',
          'name',
          'introduction',
          'avatar',
          'createdAt',
          'updatedAt'
        ],
        order: [['createdAt', 'DESC']]
      })
      const usersData = allUsers.map(user => user.toJSON())
      cb(null, usersData)
    } catch (err) {
      cb(err)
    }
  },
  getAllSuspension: async (req, cb) => {
    try {
      const allUsers = await User.findAll({
        where: { isSuspended: true },
        attributes: [
          'id',
          'name',
          'email',
          'introduction',
          'avatar',
          'isSuspended',
          'createdAt',
          'updatedAt'
        ],
        order: [['createdAt', 'DESC']]
      })
      const usersData = allUsers.map(user => user.toJSON())
      cb(null, usersData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminServices
