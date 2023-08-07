const trailServices = require('../../services/trail-services')

const trailController = {
  getAllTrails: (req, res, next) => {
    trailServices.getAllTrails(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTrail: (req, res, next) => {
    trailServices.getTrail(req, (err, data) => err ? next(err) : res.json(data))
  },
  searchTrailByKeyword: (req, res, next) => {
    trailServices.searchTrailByKeyword(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTopTrails: (req, res, next) => {
    trailServices.getTopTrails(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = trailController
