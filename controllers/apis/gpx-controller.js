const gpxServices = require('../../services/gpx-services.js')

const gpxController = {
  parseGpxToJson: (req, res, next) => {
    gpxServices.parseGpxToJson(req, (err, data) => err ? next(err) : res.json(data))
  },
  parseJsonToGpxThenSaveTemp: (req, res, next) => {
    gpxServices.parseJsonToGpxThenSaveTemp(req, (err, data) => err ? next(err) : res.json(data))
  },
  saveParsedJsonToMysql: (req, res, next) => {
    gpxServices.saveParsedJsonToMysql(req, (err, data) => err ? next(err) : res.json(data))
  },
  retrieveJsonFromMysql: (req, res, next) => {
    gpxServices.retrieveJsonFromMysql(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = gpxController
