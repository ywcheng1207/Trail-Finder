const sequelize = require('sequelize')
const { User, Post, Like, Favorite, Report } = require('../models')
const { imgurFileHandler } = require('../helpers/file-heplers')
const { Op } = require('sequelize')

const postServices = {
  getPost: async (req, cb) => {
    try {
      const userId = req.user ? req.user.id : 0
      const postId = req.params.postId
      const post = await Post.findOne({
        where: { id: postId, inProgress: false },
        include: [
          {
            model: User,
            attributes: [
              'id',
              'name',
              'avatar',
              [
                sequelize.literal(
                  `(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id AND Followships.followerId = ${userId})`
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
              '(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id)'
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)'
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id AND Favorites.userId = ${userId})`
            ),
            'isFavorite'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${userId})`
            ),
            'isLike'
          ]
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!post) {
        const err = new Error('Cannot find post!')
        err.status = 404
        throw err
      }
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
      const userId = req?.user ? req.user.id : 0
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
              '(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id)'
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)'
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
                `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id AND Favorites.userId = ${userId})`
            ),
            'isFavorite'
          ],
          [
            sequelize.literal(
                `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${userId})`
            ),
            'isLike'
          ]
        ],
        limit,
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
  getUserAllPosts: async (req, cb) => {
    try {
      const userId = req.user.id
      const user = await User.findOne({
        where: { id: userId, isSuspended: false }
      })
      if (!user) {
        const err = new Error('User dose not exist!')
        err.status = 404
        throw err
      }
      const allPosts = await Post.findAll({
        where: { userId },
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
              '(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id)'
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id)'
            ),
            'likeCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.postId = Post.id AND Favorites.userId = ${userId})`
            ),
            'isFavorite'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.postId = Post.id AND Likes.userId = ${userId})`
            ),
            'isLike'
          ]
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
        title,
        category,
        description,
        image: filePath || null,
        difficulty,
        recommend,
        inProgress: false,
        userId
      })
      if (!post) {
        const err = new Error('Posted post fail!')
        err.status = 500
        throw err
      }
      cb(null, {
        message: 'Post successfully sent.',
        postId: post.id,
        userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
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
        title,
        category,
        description,
        image: filePath || null,
        difficulty,
        recommend,
        inProgress: true,
        userId
      })
      if (!post) {
        const err = new Error('Posted post fail!')
        err.status = 500
        throw err
      }
      cb(null, {
        message: 'Temp post successfully sent.',
        postId: post.id,
        userId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
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
          'updatedAt'
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
  addLike: async (req, cb) => {
    try {
      const userId = req.user.id
      const postId = req.body.postId
      const [post, like] = await Promise.all([
        Post.findOne({
          where: { id: postId, inProgress: false }
        }),
        Like.findOne({
          where: { userId, postId }
        })
      ])
      if (!post) {
        const err = new Error('Cannot find post!')
        err.status = 404
        throw err
      }
      if (like) {
        const err = new Error('You already like this post!')
        err.status = 404
        throw err
      }
      const likePost = await Like.create({
        userId,
        postId
      })
      cb(null, likePost)
    } catch (err) {
      cb(err)
    }
  },
  editPost: async (req, cb) => {
    try {
      const currentUserId = req.user.id
      const postId = req.params.postId
      const { title, category, description, difficulty, recommend } = req.body
      const { file } = req
      const [post, filePaht] = await Promise.all([
        Post.findByPk(postId),
        imgurFileHandler(file)
      ])
      if (!post) {
        const err = new Error('Post dose not exists!')
        err.status = 404
        throw err
      }
      const postJson = { ...post.toJSON() }
      const postUser = postJson.userId
      if (postUser !== currentUserId) {
        const err = new Error('Cannot edit other users Post!')
        err.status = 404
        throw err
      }
      const editPost = await post.update({
        title: title || post.title,
        category: category || post.category,
        description: description || post.description,
        image: filePaht || post.image,
        difficulty: difficulty || post.difficulty,
        recommend: recommend || post.recommend
      })
      cb(null, editPost)
    } catch (err) {
      cb(err)
    }
  },
  deleteLike: async (req, cb) => {
    try {
      const userId = req.user.id
      const postId = req.params.postId
      const [post, like] = await Promise.all([
        Post.findOne({
          where: { id: postId, inProgress: false }
        }),
        Like.findOne({
          where: { userId, postId }
        })
      ])
      if (!post) {
        const err = new Error('Cannot find post!')
        err.status = 404
        throw err
      }
      if (!like) {
        const err = new Error('You have not liked this post!')
        err.status = 404
        throw err
      }
      await like.destroy()
      cb(null, {
        message: 'Like deleted successfully',
        likeId: like.id,
        postId
      })
    } catch (err) {
      cb(err)
    }
  },
  deletePost: async (req, cb) => {
    try {
      const currentUserId = req.user.id
      const postId = req.params.postId
      const post = await Post.findByPk(postId)
      if (!post) {
        const err = new Error('Post dose not exists!')
        err.status = 404
        throw err
      }
      const postJson = { ...post.toJSON() }
      const postUser = postJson.userId
      if (postUser !== currentUserId) {
        const err = new Error('Cannot delete other users Post!')
        err.status = 404
        throw err
      }
      await post.destroy()
      cb(null, {
        message: 'Post deleted successfully.',
        postTitle: postJson.title,
        userId: postJson.id
      })
    } catch (err) {
      cb(err)
    }
  },
  addCollect: async (req, cb) => {
    try {
      const userId = req.user.id
      const postId = req.body.postId
      const [post, favorite] = await Promise.all([
        Post.findOne({
          where: { id: postId, inProgress: false }
        }),
        Favorite.findOne({
          where: { userId: userId, postId: postId }
        })
      ])
      if (!post) {
        const err = new Error('Cannot find post!')
        err.status = 404
        throw err
      }
      if (favorite) {
        const err = new Error('You already favorite this post!')
        err.status = 404
        throw err
      }
      const newFavorite = await Favorite.create({
        userId: userId,
        postId: postId
      })
      cb(null, newFavorite)
    } catch (err) {
      cb(err)
    }
  },
  deleteCollect: async (req, cb) => {
    try {
      const userId = req.user.id
      const postId = req.params.postId
      const [post, favorite] = await Promise.all([
        Post.findOne({
          where: { id: postId, inProgress: false }
        }),
        Favorite.findOne({
          where: { userId: userId, postId: postId }
        })
      ])
      if (!post) {
        const err = new Error('Cannot find post!')
        err.status = 404
        throw err
      }
      if (!favorite) {
        const err = new Error('You have not favorited this post!')
        err.status = 404
        throw err
      }
      await favorite.destroy()
      cb(null, {
        message: 'Favorite deleted successfully',
        FavoriteId: Favorite.id,
        postId: postId
      })
    } catch (err) {
      cb(err)
    }
  },
  addReport: async (req, cb) => {
    try {
      const userId = req.user.id
      const postId = req.body.postId
      const { category, content } = req.body
      const [post, report] = await Promise.all([
        Post.findOne({
          where: { id: postId, inProgress: false }
        }),
        Report.findOne({
          where: { userId: userId, postId: postId }
        })
      ])
      if (!post) {
        const err = new Error('Cannot find post!')
        err.status = 404
        throw err
      }
      if (report) {
        const err = new Error('You already reported this post!')
        err.status = 404
        throw err
      }
      const newReport = await Report.create({
        category: category,
        content: content,
        userId: userId,
        postId: postId,
        isSolved: false
      })
      cb(null, newReport)
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
