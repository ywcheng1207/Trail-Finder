const sequelize = require('sequelize')
const { Trail } = require('../models')
const { imgurFileHandler } = require('../helpers/file-heplers')
const { XMLBuilder } = require('fast-xml-parser')

const trailServices = {
  getAllTrails: async (req, cb) => {
    try {
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
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.trailId = Trail.id)`
            ),
            'favoriteCount'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Favorites WHERE Favorites.trailId = Trail.id AND Favorites.userId = ${req.user.id})`
            ),
            'isFavorite'
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Likes WHERE Likes.trailId = Trail.id AND Likes.userId = ${req.user.id})`
            ),
            'isLike'
          ],
        ],
        order: [['createdAt', 'DESC']]
      })
      const allTrailData = allTrails.map(trail => {
        const trailJson = trail.toJSON()
        trailJson.isFavorite = Boolean(trailJson.isFavorite)
        trailJson.isLike = Boolean(trailJson.isLike)
        return trailJson
      })
      cb(null, allTrailData)
    } catch (err) {
      cb(err)
    }
  },
  getTrailsGPX: async (req, cb) => {
    try {
      const allTrails = await Trail.findAll({
        attributes: [
          'id',
          'title',
          'gpx',
          'createdAt',
          'updatedAt',
        ],
        order: [['createdAt', 'DESC']]
      })
      const allTrailData = allTrails.map(trail => {
        const trailJson = trail.toJSON()
        // 將 gpx 字串解析為 JSON 物件
        const gpxJson = JSON.parse(trailJson.gpx)
        // 將 gpx JSON 物件轉換為 GPX XML 字串
        const builderOptions = {
          attributeNamePrefix: '@_',
          attrNodeName: 'attr',
          textNodeName: '#text',
          ignoreAttributes: false,
          cdataTagName: '__cdata',
          cdataPositionChar: '\\c',
          format: true,
          indentBy: '  ',
        }
        console.log(allTrailData)
        const builder = new XMLBuilder(builderOptions)
        const gpxXml = builder.build(gpxJson)
        // 更新 trailJson 中的 gpx 屬性為 GPX XML 字串
        trailJson.gpx = gpxXml
        return trailJson
      })
      cb(null, allTrailData)
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = trailServices
