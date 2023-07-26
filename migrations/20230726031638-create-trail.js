'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Trails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      gpx: {
        type: Sequelize.JSON
      },
      image: {
        type: Sequelize.STRING
      },
      startingPoint: {
        type: Sequelize.STRING
      },
      track: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT
      },
      introduction: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      distance: {
        type: Sequelize.STRING
      },
      trailType: {
        type: Sequelize.STRING
      },
      trailFormat: {
        type: Sequelize.STRING
      },
      altitude: {
        type: Sequelize.STRING
      },
      heightDiff: {
        type: Sequelize.STRING
      },
      trailCondition: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.STRING
      },
      difficulty: {
        type: Sequelize.STRING
      },
      parkOwnership: {
        type: Sequelize.STRING
      },
      permitRequiredForEntry: {
        type: Sequelize.STRING
      },
      permitRequiredForParkAccess: {
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Trails')
  }
}
