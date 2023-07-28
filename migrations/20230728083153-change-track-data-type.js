'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Trails', 'track', {
      type: Sequelize.TEXT,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Trails', 'track', {
      type: Sequelize.STRING,
      allowNull: true
    })
  }
}
