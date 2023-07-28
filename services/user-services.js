const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const { User, Favorite, Followship } = require('../models')
const jwt = require('jsonwebtoken')

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
          // [
          //   sequelize.literal(
          //     `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = ${userId} AND Followships.)`
          //   ),
          //   'isFollow'
          // ],
        ]
      })
      if (!user) {
        const err = new Error('User dose not exists!')
        err.status = 404
        throw err
      }
      const userData = {
        ...user.toJSON()
      }
      cb(null, { user: userData })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
