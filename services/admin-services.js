const jwt = require('jsonwebtoken')
const { User, Post, Favorite, Followship, Notification, Report } = require('../models')

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
        notify,
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
  },
  deletePost: async (req, cb) => {
    try {
      const postId = req.params.postId
      const post = await Post.findOne({
        where: { id: postId, inProgress: false }
      })
      if (!post) {
        const err = new Error('Post does not exist!')
        err.status = 404
        throw err
      }
      const postTitle = post.title
      await post.destroy()
      cb(null, { message: 'Post deleted successfully.', postTitle })
    } catch (err) {
      cb(err)
    }
  },
  getAllReports: async (req, cb) => {
    try {
      const reports = await Report.findAll({
        include: [
          { model: Post,
            include: [
              { model: User, attributes: ['id', 'name'] }
            ],
            attributes: ['id', 'title'] 
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      const reportsData = reports.map(report => report.toJSON())
      cb(null, reportsData)
    } catch (err) {
      cb(err)
    }
  },
  editReportSolved: async (req, cb) => {
    try {
      const reportId = req.params.reportId
      const report = await Report.findOne({
        where: { id: reportId, isSolved: false }
      })
      if (!report) {
        const err = new Error('Cannot find report!')
        err.status = 404
        throw err
      }
      const updateReport = await report.update({
        isSolved: true
      })
      cb(null, updateReport)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminServices
