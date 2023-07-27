const express = require('express')
const router = express.Router()

const { admin, followships, posts, trails, users } = require('../../models')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.post('/users', userController.signUp)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.'))

module.exports = router
