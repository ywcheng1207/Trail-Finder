const express = require('express')
const router = express.Router()

const gpxController = require('../../../controllers/apis/gpx-controller.js')

router.get('/parsexml', gpxController.parseGpxToJson)
router.get('/buildxml', gpxController.parseJsonToGpxThenSaveTemp)
router.get('/savejson', gpxController.saveParsedJsonToMysql)
router.get('/getjson/:id', gpxController.retrieveJsonFromMysql)

module.exports = router
