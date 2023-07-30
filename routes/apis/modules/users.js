const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')

router.get('/:userId/favorites/post', userController.getUserFavoritePost)
router.put('/:id', upload.single('avatar'), userController.editUserData)

router.get('/:id', userController.getUserData)
router.use('/', (req, res) => res.send('this is user page.'))

module.exports = router
