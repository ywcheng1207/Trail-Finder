const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const posts = require('./modules/posts')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { signInAuth, isUser, isAdmin, authenticated } = require('../../middleware/auth')

router.post('/users/signin', signInAuth, isUser, userController.signIn)
router.post('/users', userController.signUp)

router.use('/users', authenticated, users)
router.use('/posts', posts)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.'))

module.exports = router
