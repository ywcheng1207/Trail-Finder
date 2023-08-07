const sequelize = require('sequelize')
const { Trail } = require('../models')
const { Op } = require('sequelize')

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
  },
  getTrail: async (req, cb) => {
    try {
      const userId = req.user ? req.user.id : 0
      const trailId = req.params.trailId
      const trail = await Trail.findByPk(trailId, {
        attributes: [
          'id',
          'title',
          'category',
          'introduction',
          'location',
          'distance',
          'trailType',
          'trailFormat',
          'altitude',
          'heightDiff',
          'trailCondition',
          'duration',
          'difficulty',
          'parkOwnership',
          'permitRequiredForEntry',
          'permitRequiredForParkAccess',
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
      if (trail === null) { // 補上null錯誤處理
        const err = new Error('Trail not found')
        err.status = 404
        throw err
      }
      const trailData = {
        ...trail.toJSON()
      }
      trailData.favoriteCount = Boolean(trailData.favoriteCount)
      trailData.isFavorite = Boolean(trailData.isFavorite)
      cb(null, trailData)
    } catch (err) {
      cb(err)
    }
  },
  searchTrailByKeyword: async (req, cb) => {
    try {
      const userId = req.user ? req.user.id : 0
      const keyword = req.query.keyword
      const trails = await Trail.findAll({
        where: {
          [Op.or]: [
            sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', `%${keyword.toLowerCase()}%`),
            sequelize.where(sequelize.fn('LOWER', sequelize.col('category')), 'LIKE', `%${keyword.toLowerCase()}%`)
          ]
        },
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

      const searchData = trails
        .filter(trail => trail !== null && trail !== undefined)
        .map(trail => {
          const trailData = trail.toJSON()
          return trailData
        })

      cb(null, searchData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = trailServices
