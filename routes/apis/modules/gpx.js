const express = require('express')
const router = express.Router()

const gpxController = require('../../../controllers/apis/gpx-controller.js')

router.get('/parsexml', gpxController.parseGpxToJson)
router.get('/buildxml', gpxController.parseJsonToGpx)

module.exports = router
