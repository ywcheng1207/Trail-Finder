const express = require('express')
const router = express.Router()

const users = require('./modules/users')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.post('/users', userController.signUp)

router.use('/users', users)

router.use('/', apiErrorHandler)
router.use('/', (req, res) => res.send('this is home page.'))

module.exports = router
