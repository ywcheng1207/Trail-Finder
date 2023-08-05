const sequelize = require('sequelize')
const { User, Post } = require('../models')
const { imgurFileHandler } = require('../helpers/file-heplers')
const { Op } = require('sequelize')

const postServices = {
  getPost: async (req, cb) => {
    try {
      const postId = req.params.postId
      const post = await Post.findByPk(postId ,{
        include: [
          { 
            model: User, 
            attributes: [
              'id', 
              'name', 
              'avatar',
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id AND Followships.followerId = ${req.user.id})`
                ),
                'isFollow'
              ]
            ]
          }
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
          ]
        ],
        order: [['createdAt', 'DESC']]
      })
      const postsData = {
        ...post.toJSON()
      }
      postsData.isFavorite = Boolean(postsData.isFavorite)
      postsData.isLike = Boolean(postsData.isLike)
      postsData.User.isFollow = Boolean(postsData.User.isFollow)
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
  },
  postPost: async (req, cb) => {
    try {
      const userId = req.user.id
      const { title, category, description, difficulty, recommend } = req.body
      const { file } = req
      const filePath = await imgurFileHandler(file)
      const post = await Post.create({
        title: title,
        category: category,
        description: description,
        image: filePath || null,
        difficulty: difficulty,
        recommend: recommend,
        inProgress: false,
        userId: userId
      })
      if (!post) {
        const err = new Error('Posted post fail!')
        err.status = 500
        throw err
      }
      cb(null, {
        message: 'Post successfully sent.',
        userId: userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
    } catch (err) {
      cb(err)
    }
  },
  postTempPost: async (req, cb) => {
    try {
      const userId = req.user.id
      const { title, category, description, difficulty, recommend } = req.body
      const { file } = req
      const filePath = await imgurFileHandler(file)
      const post = await Post.create({
        title: title,
        category: category,
        description: description,
        image: filePath || null,
        difficulty: difficulty,
        recommend: recommend,
        inProgress: true,
        userId: userId
      })
      if (!post) {
        const err = new Error('Posted post fail!')
        err.status = 500
        throw err
      }
      cb(null, {
        message: 'Temp post successfully sent.',
        userId: userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
    } catch (err) {
      cb(err)
    }
  },
  getTempPost: async (req, cb) => {
    try {
      const postId = req.params.postId
      const tempPost = await Post.findOne({
        where: { id: postId, inProgress: true },
        attributes: [
          'id',
          'title',
          'category',
          'description',
          'image',
          'difficulty',
          'recommend',
          'inProgress',
          'userId',
          'createdAt',
          'updatedAt',
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tempPost) {
        const err = new Error('Cannot find draft post!')
        err.status = 404
        throw err
      }
      if (tempPost.userId !== req.user.id) {
        const err = new Error('Cannot get other users draft post!')
        err.status = 404
        throw err
      }
      const postsData = {
        ...tempPost.toJSON()
      }
      cb(null, postsData)
    } catch (err) {
      cb(err)
    }
  },
  searchPostByKeyword: async (req, cb) => {
    try {
      const keyword = req.query.keyword
      const posts = await Post.findAll({
        where: {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${keyword}%`
              },
              category: {
                [Op.like]: `%${keyword}%`
              },
              description: {
                [Op.like]: `%${keyword}%`
              },
            }
          ],
          inProgress: false
        },
        order: [['createdAt', 'DESC']]
      })
      const searchData = posts.map(post => post.toJSON())
      cb(null, searchData)
    } catch (err) {
      cb(err)      
    }
  }
}

module.exports = postServices
