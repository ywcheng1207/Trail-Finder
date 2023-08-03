const express = require('express')
const router = express.Router()

const followshipController = require('../../../controllers/apis/followship-controller')

router.delete('/:userId', followshipController.deleteFollowing)
router.post('/', followshipController.addFollowing)

router.use('/', (req, res) => res.send('this is followship page.'))

module.exports = router
