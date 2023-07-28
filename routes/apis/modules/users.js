const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')

router.get('/:id', userController.getUserData)
router.use('/', (req, res) => res.send('this is user page.'))

module.exports = router
