const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const { User, Favorite, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-heplers')
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

      const [user, filePaht] = await Promise.all ([
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
        introduction: introduction || user.introduction,
      })
      cb(null, { message: 'User info edited successfully' })
    } catch (err) {
      cb(err)
    }
  },
  getUserData: async (req, cb) => {
    try {
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
              `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = ${userId} AND Followships.followerId = ${req.user.id})`
            ),
            'isFollow'
          ],
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
  }
}

module.exports = userServices
