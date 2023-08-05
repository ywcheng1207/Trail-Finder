const express = require('express')
const router = express.Router()
const trailController = require('../../../controllers/apis/trail-controller')

router.get('/', trailController.getAllTrails)
router.get('/gpx/:trailId', trailController.getTrailsGPX)


module.exports = router
