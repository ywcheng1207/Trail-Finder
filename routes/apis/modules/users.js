const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/apis/user-controller')

router.put('/:id', userController.editUserData)

module.exports = router
