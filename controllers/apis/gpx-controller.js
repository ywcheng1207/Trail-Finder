const gpxServices = require('../../services/gpx-services.js')

const gpxController = {
  parseGpxToJson: (req, res, next) => {
    gpxServices.parseGpxToJson(req, (err, data) => err ? next(err) : res.json(data))
  },
  parseJsonToGpx: (req, res, next) => {
    gpxServices.parseJsonToGpx(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = gpxController
