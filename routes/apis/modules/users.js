const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')
const { authenticated, optionalAuthenticated } = require('../../../middleware/auth')

router.put('/notifications/:notificationId', authenticated, userController.isReadNotification)
router.get('/:userId/favorites/trail', optionalAuthenticated, userController.getUserFavoriteTrail)
router.get('/:userId/favorites/post', optionalAuthenticated, userController.getUserFavoritePost)
router.get('/:userId/notifications', authenticated, userController.getUserNotifications)
router.get('/:userId/followings', optionalAuthenticated, userController.getUserFollowings)
router.get('/:userId/followers', optionalAuthenticated, userController.getUserFollowers)
router.get('/:userId/posts', optionalAuthenticated, userController.getUserPosts)
router.get('/:id', optionalAuthenticated, userController.getUserData)
router.put('/:id', authenticated, upload.single('avatar'), userController.editUserData)

router.use('/', (req, res) => res.send('this is user page.'))

module.exports = router
