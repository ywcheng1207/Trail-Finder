const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')

router.get('/:userId/followings', userController.getUserFollowings)
router.get('/:userId/followers', userController.getUserFollowers)
router.get('/:userId/favorites/post', userController.getUserFavoritePost)
router.get('/:userId/posts', userController.getUserPosts)
router.get('/:id', userController.getUserData)
router.put('/:id', upload.single('avatar'), userController.editUserData)

router.use('/', (req, res) => res.send('this is user page.'))

module.exports = router
