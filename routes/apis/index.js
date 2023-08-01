const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const posts = require('./modules/posts')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { signInAuth, isUser, isAdmin, authenticated } = require('../../middleware/auth')

router.post('/users/signin', signInAuth, isUser, userController.signIn)
router.post('/admin/signin', signInAuth, isAdmin, adminController.signIn)
router.post('/users', userController.signUp)

router.use('/admin', authenticated, isAdmin, admin)
router.use('/users', authenticated, isUser, users)
router.use('/posts', authenticated, isUser, posts)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.'))

module.exports = router
