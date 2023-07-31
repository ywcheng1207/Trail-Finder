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
  }
}

module.exports = postServices
