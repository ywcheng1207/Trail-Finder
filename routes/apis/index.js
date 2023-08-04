const express = require('express')
const router = express.Router()

const trails = require('./modules/trails')

const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { signInAuth, isUser, isAdmin } = require('../../middleware/auth')

router.post('/users/signin', signInAuth, isUser, userController.signIn)
router.post('/users', userController.signUp)

router.use('/trails', trails)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.'))

module.exports = router
