'use strict'

const trailData = require('../path/trailInformation.json')
const { Trail } = require('../models')

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const trailTitles = trailData.map(trail => trail.title)
      const existingTrails = await Trail.findAll({
        where: {
          title: trailTitles
        }
      })

      const newTrails = trailData.filter(trail => !existingTrails.some(existingTrail => existingTrail.title === trail.title))
      if (newTrails.length > 0) {
        const formattedTrails = newTrails.map(trail => ({
          ...trail,
          gpx: trail.gpx ? JSON.stringify(trail.gpx) : null
        }))
        await Trail.bulkCreate(formattedTrails)
      }
    } catch (error) {
      throw new Error('Seeding failed: ' + error)
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trails', {})
  }
}
