const trailServices = require('../../services/trail-services')

const trailController = {
  getAllTrails: (req, res, next) => {
    trailServices.getAllTrails(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTrail: (req, res, next) => {
    trailServices.getTrail(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  searchTrailByKeyword: (req, res, next) => {
    trailServices.searchTrailByKeyword(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postCondition: (req, res, next) => {
    trailServices.postCondition(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getConditions: (req, res, next) => {
    trailServices.getConditions(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  addFavoriteTrail: (req, res, next) => {
    trailServices.addFavoriteTrail(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteFavoriteTrail: (req, res, next) => {
    trailServices.deleteFavoriteTrail(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTrailsGPX: (req, res, next) => {
    trailServices.getTrailsGPX(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = trailController
