const express = require('express')
const router = express.Router()
const trailController = require('../../../controllers/apis/trail-controller')

const { optionalAuthenticated } = require('../../../middleware/auth')

router.get('/', optionalAuthenticated, trailController.getAllTrails)
router.get('/gpx/:trailId', optionalAuthenticated, trailController.getTrailsGPX)

router.use('/', (req, res) => res.send('this is trail page.'))

module.exports = router
