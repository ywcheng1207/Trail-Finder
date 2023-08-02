const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const { User, Post, Favorite, Followship, Notification } = require('../models')

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
  },
  addSuspension: async (req, cb) => {
    try {
      const userId = req.body.userId
      const user = await User.findByPk(userId)
      if (!user) {
        const err = new Error('User does not exist!')
        err.status = 404
        throw err
      }
      if (user.isSuspended === true) {
        const err = new Error('User is already suspended!')
        err.status = 404
        throw err
      }
      const userUpdate = await user.update({
        isSuspended: true
      })
      if (!userUpdate) {
        const err = new Error('Update fail')
        err.status = 500
        throw err
      }
      const userData = {
        ...userUpdate.toJSON()
      }
      cb(null, {
        message: 'Suspend successfully',
        userId: userData.id, 
        createdAt: userData.createdAt, 
        updatedAt: userData.updatedAt
      })
    } catch (err) {
      cb(err)
    }
  },
  removeSuspension: async (req, cb) => {
    try {
      const userId = req.body.userId
      const user = await User.findByPk(userId)
      if (!user) {
        const err = new Error('User does not exist!')
        err.status = 404
        throw err
      }
      if (user.isSuspended === false) {
        const err = new Error('This user is now able to use!')
        err.status = 404
        throw err
      }
      const userUpdate = await user.update({
        isSuspended: false
      })
      if (!userUpdate) {
        const err = new Error('Update fail')
        err.status = 500
        throw err
      }
      const userData = {
        ...userUpdate.toJSON()
      }
      cb(null, {
        message: 'Remove suspension successfully',
        userId: userData.id,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      })
    } catch (err) {
      cb(err)
    }
  },
  sendNotify: async (req, cb) => {
    try {
      const userId = req.params.userId
      const { notify } = req.body
      const user = await User.findByPk(userId)
      if (!user) {
        const err = new Error('User does not exist!')
        err.status = 404
        throw err
      }
      const notification = await Notification.create({
        notify: notify,
        isRead: false,
        userId: user.id
      })
      const notifyData = {
        ...notification.toJSON()
      }
      cb(null, notifyData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminServices
