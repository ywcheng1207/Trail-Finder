const express = require('express')
const router = express.Router()

const { admin, followships, posts, trails, users } = require('../../models')

router.use('/', (req, res) => res.send('this is home page.'))

module.exports = router
