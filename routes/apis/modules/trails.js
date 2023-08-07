const express = require('express')
const router = express.Router()

const trailController = require('../../../controllers/apis/trail-controller')

const { optionalAuthenticated } = require('../../../middleware/auth')

router.get('/search', trailController.searchTrailByKeyword)
router.get('/:trailId', optionalAuthenticated, trailController.getTrail)
router.get('/', optionalAuthenticated, trailController.getTopTrails)
router.get('/', optionalAuthenticated, trailController.getAllTrails)

router.use('/', (req, res) => res.send('this is trail page.'))

module.exports = router
