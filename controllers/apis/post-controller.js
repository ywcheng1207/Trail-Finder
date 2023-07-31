const postServices = require('../../services/post-services')

const postController = {
  getPosts: (req, res, next) => {
    postServices.getPosts(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getAllPosts: (req, res, next) => {
    postServices.getAllPosts(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}

module.exports = postController