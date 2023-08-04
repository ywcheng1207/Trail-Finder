const sequelize = require('sequelize')
const { User, Post, Favorite, Followship } = require('../models')

const followshipServices = {
  addFollowing: async (req, cb) => {
    try {
      const followingId = req.body.userId
      const followerId = req.user.id
      if (followingId === followerId.toString()) {
        const err = new Error("Can't follow yourself!")
        err.status = 404
        throw err
      }
      const [followship, following] = await Promise.all([
        Followship.findOne({
          where: { followerId, followingId }
        }),
        User.findByPk(followingId)
      ])
      if (followship) {
        const err = new Error('You are already following this user!')
        err.status = 404
        throw err
      }
      if (!following) {
        const err = new Error('User does not exist!')
        err.status = 404
        throw err
      }
      if (following.isSuspended === true) {
        const err = new Error('User is suspended')
        err.status = 404
        throw err
      }
      const createdFollowship = await Followship.create({
        followerId,
        followingId
      })
      cb(null, createdFollowship)
    } catch (err) {
      cb(err)
    }
  },
  deleteFollowing: async (req, cb) => {
    try {
      const followingId = req.params.userId
      const followerId = req.user.id
      const followship = await Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
      if (!followship) {
        const err = new Error("You haven't following this user!")
        err.status = 404
        throw err
      }
      await followship.destroy()
      cb(null, { message: 'Followship deleted successfully' })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = followshipServices
