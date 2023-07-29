const express = require('express')
const router = express.Router()

const userController = require('../../../controllers/apis/user-controller')
const upload = require('../../../middleware/multer')

router.put('/:id', upload.single('avatar'), userController.editUserData)

module.exports = router
