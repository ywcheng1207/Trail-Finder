const express = require('express')
const router = express.Router()
const trailController = require('../../../controllers/apis/trail-controller')

router.get('/trails', trailController.getAllTrails)
router.get('/trails/gpx/:trailId', trailController.getTrailsGPX)


module.exports = router
