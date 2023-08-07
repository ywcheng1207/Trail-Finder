const sequelize = require('sequelize')
const { Trail } = require('../models')

// const fs = require('fs')
// const gpxServices = require('./gpx-services.js')

const trailServices = {
  getAllTrails: async (req, cb) => {
    try {
      const userId = req?.user ? req.user.id : 0
      const allTrails = await Trail.findAll({
        attributes: [
          'id',
          'title',
          'distance',
          'duration',
          'difficulty',
          'image',
          'createdAt',
          'updatedAt',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Favorites WHERE Favorites.trailId = Trail.id)'
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.trailId = Trail.id AND Favorites.userId = ${userId})`
            ),
            'isFavorite'
          ]
        ],
        order: [['createdAt', 'DESC']]
      })
      const allTrailData = allTrails.map(trail => {
        const trailJson = trail.toJSON()
        trailJson.isFavorite = Boolean(trailJson.isFavorite)
        return trailJson
      })
      cb(null, allTrailData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = trailServices
