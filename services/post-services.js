const sequelize = require('sequelize')
const { User, Post } = require('../models')
const { imgurFileHandler } = require('../helpers/file-heplers')

const postServices = {
  getPost: async (req, cb) => {
    try {
      const postId = req.params.postId
      const post = await Post.findByPk(postId ,{
        include: [
          { model: User, attributes: ['id', 'name', 'avatar'] }
        ],
        attributes: [
          'id',
          'title',
          'category',
          'description',
          'image',
          'difficulty',
          'recommend',
          'userId',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id)`
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)`
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id AND Favorites.userId = ${req.user.id})`
            ),
            'isFavorite'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${req.user.id})`
            ),
            'isLike'
          ],
        ],
        order: [['createdAt', 'DESC']]
      })
      const postsData = {
        ...post.toJSON()
      }
      cb(null, postsData)
    } catch (err) {
      cb(err)
    }   
  },
  getPosts: async (req, cb) => {
    try {
      const limit = Number(req.query.limit) || null
      const posts = await Post.findAll({
        where: { inProgress: false },
          include: [
            { model: User, attributes: ['id', 'name', 'avatar'] }
          ],
          attributes: [
            'id',
            'title',
            'category',
            'image',
            'difficulty',
            'recommend',
            'userId',
            'createdAt',
            'updatedAt',
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id)`
              ),
              'favoriteCount'
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)`
              ),
              'likeCount'
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id AND Favorites.userId = ${req.user.id})`
              ),
              'isFavorite'
            ],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${req.user.id})`
              ),
              'isLike'
            ],
          ],
        limit: limit,
        order: [['createdAt', 'DESC']]
      })
      const postsData = posts.map(post => {
        const postJson = post.toJSON()
        postJson.isFavorite = Boolean(postJson.isFavorite)
        postJson.isLike = Boolean(postJson.isLike)
        return postJson
      })
        cb(null, postsData)
      } catch (err) {
        cb(err)
      }

  },
  getAllPosts: async (req, cb) => {
    try {
      const allPosts = await Post.findAll({
        include: [
          { model: User, attributes: ['id', 'name', 'avatar'] }
        ],
        attributes: [
          'id',
          'title',
          'category',
          'image',
          'difficulty',
          'recommend',
          'inProgress',
          'userId',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id)`
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)`
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id AND Favorites.userId = ${req.user.id})`
            ),
            'isFavorite'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${req.user.id})`
            ),
            'isLike'
          ],
        ],
        order: [['createdAt', 'DESC']]
      })
      const allPostsData = allPosts.map(post => {
        const postJson = post.toJSON()
        postJson.isFavorite = Boolean(postJson.isFavorite)
        postJson.isLike = Boolean(postJson.isLike)
        return postJson
      })
      cb(null, allPostsData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = postServices
