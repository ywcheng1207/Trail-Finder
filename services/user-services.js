const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-heplers')
const { User, Post, Favorite, Followship, Notification, Trail } = require('../models')
const { Sequelize } = require('sequelize')

const userServices = {
  signIn: async (req, cb) => {
    try {
      const userData = req.user
      if (userData.isSuspended === true) {
        const err = new Error('User is suspended')
        err.status = 404
        throw err
      }
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
      if (password !== passwordCheck) {
        const err = new Error('Passwords do not match!')
        err.status = 404
        throw err
      }

      const user = await User.findOne({ where: { email } })
      if (user) {
        const err = new Error('Email already exists!')
        err.status = 404
        throw err
      }

      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete newUser.dataValues.password // 不確定有沒有更好移除密碼的方法，先湊合著用
      cb(null, { user: newUser })
    } catch (err) {
      cb(err)
    }
  },
  getUserPosts: async (req, cb) => {
    try {
      const userId = req.params.userId
      const posts = await Post.findAll({
        where: { userId, inProgress: false },
        include: [
          { model: User, attributes: ['id', 'avatar'] }
        ],
        attributes: [
          'id',
          'title',
          [sequelize.fn('SUBSTRING', Sequelize.col('description'), 1, 200), 'description'],
          'image',
          'difficulty',
          'userId',
          'createdAt',
          'updatedAt'
        ],
        order: [['createdAt', 'DESC']]
      })
      const postsData = posts.map(post => {
        const postJson = post.toJSON()
        console.log(postJson)
        const description = postJson.description
        if (description.length > 200) {
          postJson.description = description.slice(0, 200)
        }
        return postJson
      })
      cb(null, { post: postsData })
    } catch (err) {
      cb(err)
    }
  },
  editUserData: async (req, cb) => {
    try {
      const { name, password, introduction } = req.body
      const { file } = req
      const currentUserId = req.user.id.toString()
      const userId = req.params.id

      if (currentUserId !== userId) {
        const err = new Error('Cannot edit other users profile!')
        err.status = 404
        throw err
      }
      if (name && name.length > 50) throw new Error('Name length should <= 50')
      if (introduction && introduction.length > 160) throw new Error('Introduction length should <= 160')

      const [user, filePaht] = await Promise.all([
        User.findByPk(userId),
        imgurFileHandler(file)
      ])

      if (!user) {
        const err = new Error('User does not exist!')
        err.status = 404
        throw err
      }
      await user.update({
        name: name || user.name,
        avatar: filePaht || user.avatar,
        password: password ? await bcrypt.hash(password, 10) : user.password,
        introduction: introduction || user.introduction
      })
      cb(null, { message: 'User info edited successfully' })
    } catch (err) {
      cb(err)
    }
  },
  getUserData: async (req, cb) => {
    try {
      const currentUserId = req.user ? req.user.id : 0
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        attributes: [
          'id',
          'name',
          'email',
          'introduction',
          'avatar',
          'isSuspended',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = ${userId})`
            ),
            'followerCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = ${userId})`
            ),
            'followingCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.userId = ${userId} AND Favorites.postId IS NOT NULL)`
            ),
            'favoritePostCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = ${userId} AND Followships.followerId = ${currentUserId})`
            ),
            'isFollow'
          ]
        ]
      })
      if (!user) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const userData = {
        ...user.toJSON(),
        isFollow: Boolean(user.dataValues.isFollow)
      }
      cb(null, { user: userData })
    } catch (err) {
      cb(err)
    }
  },
  getUserFollowings: async (req, cb) => {
    try {
      const currentUserId = req.user ? req.user.id : 0
      const userId = req.params.userId
      const checkUser = await User.findByPk(userId)
      if (!checkUser) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const followings = await Followship.findAll({
        where: { followerId: userId },
        include: [
          {
            model: User,
            as: 'Following',
            attributes: ['id', 'name', 'avatar']
          }
        ],
        attributes: [
          'id',
          'followerId',
          'followingId',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = Following.id AND Followships.followerId = ${currentUserId})`
            ),
            'isFollow'
          ]
        ]
      })
      const followingsData = followings.map(function (following) {
        const followingJson = following.toJSON()
        followingJson.isFollow = Boolean(followingJson.isFollow)
        return followingJson
      })
      cb(null, { followings: followingsData })
    } catch (err) {
      cb(err)
    }
  },
  getUserFollowers: async (req, cb) => {
    try {
      const currentUserId = req.user ? req.user.id : 0
      const userId = req.params.userId
      const checkUser = await User.findByPk(userId)
      if (!checkUser) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const followers = await Followship.findAll({
        where: { followingId: userId },
        include: [
          {
            model: User,
            as: 'Follower',
            attributes: ['id', 'name', 'avatar']
          }
        ],
        attributes: [
          'id',
          'followerId',
          'followingId',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = Follower.id AND Followships.followerId = ${currentUserId})`
            ),
            'isFollow'
          ]
        ]
      })
      const followersData = followers.map(function (follower) {
        const followerJson = follower.toJSON()
        followerJson.isFollow = Boolean(followerJson.isFollow)
        return followerJson
      })
      cb(null, { followers: followersData })
    } catch (err) {
      cb(err)
    }
  },
  getUserFavoritePost: async (req, cb) => {
    try {
      const userId = req.params.userId
      const user = await User.findByPk(userId)
      if (!user) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const favorite = await Favorite.findAll({
        where: { userId, trailId: null },
        include: [
          {
            model: Post,
            include: [
              { model: User, attributes: ['id', 'name', 'avatar'] }
            ],
            attributes: [
              'id',
              'title',
              [sequelize.fn('SUBSTRING', Sequelize.col('description'), 1, 200), 'description'],
              'image',
              'userId',
              'createdAt',
              'updatedAt'
            ]
          }
        ],
        attributes: [
          'id',
          'postId'
        ],
        order: [['createdAt', 'DESC']]
      })
      if (favorite.length === 0) {
        cb(null, { message: 'No favorite posts found.' })
      }
      const favoriteData = favorite.map(post => {
        const postJson = post.toJSON()
        return postJson
      })
      const favoritePost = favoriteData.filter(post => post.Post !== null)
      cb(null, { favoritePost })
    } catch (err) {
      cb(err)
    }
  },
  getUserFavoriteTrail: async (req, cb) => {
    try {
      const userId = req.params.userId
      const user = await User.findByPk(userId)
      if (!user) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const favorite = await Favorite.findAll({
        where: { userId, postId: null },
        include: [
          {
            model: Trail,
            include: [
              { model: User, attributes: ['id', 'name', 'avatar'] }
            ],
            attributes: [
              'id',
              'title',
              'image',
              'introduction',
              'location',
              'difficulty',
              'distance',
              'duration',
              'userId',
              'createdAt',
              'updatedAt'
            ]
          }
        ],
        attributes: [
          'id',
          'trailId'
        ],
        order: [['createdAt', 'DESC']]
      })
      if (favorite.length === 0) {
        cb(null, { message: 'No favorite trail found.' })
      }
      const favoriteTrail = favorite.map(trail => trail.toJSON())
      cb(null, { favoriteTrail })
    } catch (err) {
      cb(err)
    }
  },
  getUserNotifications: async (req, cb) => {
    try {
      const userId = req.params.userId
      const user = await User.findByPk(userId)
      if (!user) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      })
      const notifyData = notifications.map(notify => notify.toJSON())
      cb(null, notifyData)
    } catch (err) {
      cb(err)
    }
  },
  isReadNotification: async (req, cb) => {
    try {
      const currentUserId = req.user.id
      const notificationId = req.params.notificationId
      const notification = await Notification.findByPk(notificationId)
      if (!notification) {
        const err = new Error('Notification dose not exists!')
        err.status = 404
        throw err
      }
      const notificationJson = { ...notification.toJSON() }
      const notificationUser = notificationJson.userId
      if (notificationUser !== currentUserId) {
        const err = new Error('Cannot isRead other users notification!')
        err.status = 404
        throw err
      }
      if (notificationJson.isRead === true) {
        const err = new Error('Notification has already been read!')
        err.status = 404
        throw err
      }
      const isReadNotification = await notification.update({
        isRead: true
      })
      console.log(isReadNotification)
      cb(null, isReadNotification)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
