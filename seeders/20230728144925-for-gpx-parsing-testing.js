'use strict'

const { Trail } = require('../models')
const gpxServices = require('../services/gpx-services.js')

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const trails = await Trail.findAll()

      if (trails.length > 0) {
        for (const trail of trails) {
          const gpxJson = JSON.parse(trail.gpx)
          const gpxXml = gpxServices.parseJsonToGpx(gpxJson)
          console.log(`Trail ID: ${trail.id}, Trail Title: ${trail.title}`)
          console.log(gpxXml)
        }
      } else {
        console.log('cannot find out this trail in database.')
      }
    } catch (error) {
      throw new Error('seeder failed: ' + error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // no needs to undo
  }
}
