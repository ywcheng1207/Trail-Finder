const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.get('/users', adminController.getAllUsers)

router.use('/', (req, res) => res.send('this is admin page.'))

module.exports = router
