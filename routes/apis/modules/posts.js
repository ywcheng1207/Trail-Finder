const express = require('express')
const router = express.Router()

const postController = require('../../../controllers/apis/post-controller')

router.get('/:postId', postController.getPost)

router.use('/', (req, res) => res.send('this is post page.'))

module.exports = router
