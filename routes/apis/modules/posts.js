const express = require('express')
const router = express.Router()

const postController = require('../../../controllers/apis/post-controller')
const { authenticated, optionalAuthenticated } = require('../../../middleware/auth')

router.get('/all', optionalAuthenticated, postController.getAllPosts)
router.get('/:postId', optionalAuthenticated, postController.getPost)
router.get('/', optionalAuthenticated, postController.getPosts)

router.use('/', (req, res) => res.send('this is post page.'))

module.exports = router
