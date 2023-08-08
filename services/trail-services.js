const sequelize = require('sequelize')
const { Trail, Condition, User, Favorite } = require('../models')
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
  },
  postCondition: async (req, cb) => {
    try {
      const userId = req.user.id
      const trailId = req.params.trailId
      const trailDescription = req.body.description
      const trail = await Trail.findByPk(trailId)

      if (!trail) {
        const err = new Error('This trail does not exist!')
        err.status = 404
        throw err
      }
      const trailCondition = await Condition.create({
        userId,
        trailId,
        description: trailDescription
      })
      cb(null, {
        message: 'Conditions successfully created.',
        userId,
        trailId,
        createdAt: trailCondition.createdAt,
        updatedAt: trailCondition.updatedAt
      })
    } catch (err) {
      cb(err)
    }
  },
  getConditions: async (req, cb) => {
    try {
      const trailId = req.params.trailId
      const conditions = await Condition.findAll({
        where: { trailId },
        include: [
          { model: User, attributes: ['id', 'name', 'avatar'] }
        ],
        attributes: [
          'id',
          'description',
          'createdAt',
          'updatedAt'
        ],
        order: [['createdAt', 'DESC']]
      })
      const allConditions = conditions.map(condition => {
        const allConditionsJson = condition.toJSON()
        return allConditionsJson
      })
      cb(null, allConditions)
    } catch (err) {
      cb(err)
    }
  },
  addFavoriteTrail: async (req, cb) => {
    try {
      const userId = req.user.id
      const trailId = req.body.trailId
      const [trail, favorite] = await Promise.all([
        Trail.findOne({
          where: { id: trailId }
        }),
        Favorite.findOne({
          where: { userId, trailId }
        })
      ])
      if (!trail) {
        const err = new Error('This trail does not exist!')
        err.status = 404
        throw err
      }
      if (favorite) {
        const err = new Error('This favorite has already been created.')
        err.status = 404
        throw err
      }
      const favoriteTrail = await Favorite.create({
        userId,
        trailId
      })
      cb(null, favoriteTrail)
    } catch (err) {
      cb(err)
    }
  },
  deleteFavoriteTrail: async (req, cb) => {
    try {
      const userId = req.user.id
      const trailId = req.params.trailId
      const [trail, favorite] = await Promise.all([
        Trail.findOne({
          where: { id: trailId }
        }),
        Favorite.findOne({
          where: { userId, trailId }
        })
      ])
      if (!trail) {
        const err = new Error('This trail does not exist!')
        err.status = 404
        throw err
      }
      if (!favorite) {
        const err = new Error('This favorite does not exist!')
        err.status = 404
        throw err
      }
      await favorite.destroy()
      cb(null, {
        message: 'Favorite deleted successfully',
        favoriteId: favorite.id,
        trailId
      })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = trailServices
