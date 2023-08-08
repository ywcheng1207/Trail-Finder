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
  postCondition: (req, res, next) => {
    trailServices.postCondition(req, (err, data) => err ? next(err) : res.json(data))
  },
  getConditions: (req, res, next) => {
    trailServices.getConditions(req, (err, data) => err ? next(err) : res.json(data))
  },
  addFavoriteTrail: (req, res, next) => {
    trailServices.addFavoriteTrail(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = trailController
