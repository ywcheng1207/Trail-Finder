'use strict'

const trailData = require('../path/trailInformation.json')
const { Trail } = require('../models')
const fs = require('fs')
const gpxServices = require('../services/gpx-services.js')

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const trailTitles = trailData.map(trail => trail.title)
      const existingTrails = await Trail.findAll({
        where: {
          title: trailTitles
        }
      })

      // 從現有的 JSON 檔案中讀取徑路資料
      const newTrails = trailData.filter(trail => !existingTrails.some(existingTrail => existingTrail.title === trail.title))
      // 檢查是否有新徑路需要處理
      if (newTrails.length > 0) {
        // 使用 Promise.all 等待所有 trails 被建立與處理
        await Promise.all(newTrails.map(async newTrail => {
          // 從檔案中讀取 gpx 資料
          const gpxPath = `./path/${newTrail.title}.gpx`
          const gpxData = fs.readFileSync(gpxPath, 'utf8')

          // 將 gpxData 解析為 JSON
          const gpxJson = gpxServices.parseGpxToJson(gpxData)

          // 建立包含處理後的 gpx 與其他屬性的新物件
          const formattedTrail = {
            ...newTrail,
            gpx: JSON.stringify(gpxJson)
          }

          // 在資料庫中建立 trails
          await Trail.create(formattedTrail)
        }))
      }
    } catch (error) {
      throw new Error('Seeding failed: ' + error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trails', {})
  }
}
