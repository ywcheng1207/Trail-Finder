const sequelize = require('sequelize')
const { Trail, Favorite, Like } = require('../models')
const fs = require('fs')
const gpxServices = require('./gpx-services.js')

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
        ],
        order: [['createdAt', 'DESC']]
      })
      const allTrailData = allTrails.map(trail => {
        const trailJson = trail.toJSON()
        trailJson.isFavorite = Boolean(trailJson.isFavorite)
        trailJson.isLike = Boolean(trailJson.isLike)
        return trailJson
      })
      // 如果 req.user.id 存在, 加入isFavorite 和 isLike 
      if (req.user && req.user.id) {
        for (const trailData of allTrailData) {
          const isFavorite = await checkIsFavorite(trailData.id, req.user.id)
          const isLike = await checkIsLike(trailData.id, req.user.id);
          trailData.isFavorite = isFavorite
          trailData.isLike = isLike
        }
      }
      //函式checkIsFavorite作為isFavorite的判斷
      async function checkIsFavorite(trailId, userId) {
        try {
          const favorite = await Favorite.findOne({
            where: {
              trailId: trailId,
              userId: userId,
            },
          })
          return !!favorite
        } catch (err) {
          console.error('Error checking favorite status:', err)
          return false
        }
      }

      //函式checkIsLike作為isLike的判斷
      async function checkIsLike(trailId, userId) {
        try {
          const like = await Like.findOne({
            where: {
              trailId: trailId,
              userId: userId,
            },
          })
          return !!like
        } catch (err) {
          console.error('Error checking like status:', err)
          return false
        }
      }

      cb(null, allTrailData)
    } catch (err) {
      cb(err)
    }
  },
  getTrailsGPX: async (req, cb) => {
    try {
      // 使用 findAll 從資料庫中獲取所有的 Trail 記錄
      const allTrails = await Trail.findAll({
        attributes: [
          'id', 
          'title', 
          'gpx', 
          'createdAt', 
          'updatedAt'
        ]
      })
      // 用來保存每個 Trail 轉換為 GPX 的異步操作的 Promise 陣列
      const trailPromises = allTrails.map(trail => {
        return new Promise((resolve, reject) => {
          // 調用 gpxServices 中的 parseJsonToGpx 函式，將 GPX JSON 轉換為 GPX XML
          gpxServices.parseJsonToGpx(trail.gpx, (err, gpxXml) => {
            if (err) {
              // 如果轉換失敗，拋出錯誤
              console.error('Error while parsing GPX XML:', err)
              reject(err)
            } else {
              // 將 GPX XML 寫入檔案
              fs.writeFileSync(`./temp/${trail.title}.gpx`, gpxXml, 'utf-8')
              // 將轉換後的資料放入解析結果的陣列
              resolve({
                trailId: trail.id,
                title: trail.title,
                createdAt: trail.createdAt,
                updatedAt: trail.updatedAt,
                gpxXml: gpxXml
              })
            }
          })
        })
      })

      // 等待所有的轉換操作都完成
      const allTrailData = await Promise.all(trailPromises)
      // 將所有的解析結果回傳
      cb(null, allTrailData)
    } catch (err) {
      // 如果有錯誤，拋出錯誤
      console.error('Error while parsing GPX XML:', err)
      console.error('Stack trace:', err.stack)
      cb(new Error('Error while parsing GPX XML'), null)
    }
  }
}

module.exports = trailServices;