const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')

router.get('/:id/posts', userController.getUserPosts)

module.exports = router
