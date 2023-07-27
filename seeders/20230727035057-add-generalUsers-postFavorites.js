'use strict'

const { User, Post, Sequelize } = require('../models')
const Op = Sequelize.Op

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const favorites = []
    const generalUsers = await User.findAll({
      where: {
        name: {
          [Op.like]: '%user%'
        }
      }
    })
    const assignedUserIds = []
    const currentPosts = await Post.findAll()
    const assignedPostIds = []

    for (let i = 0; i < 5; i++) {
      function getRandomUserId () {
        const randomUserIndex = Math.floor(Math.random() * generalUsers.length)
        const randomUserId = generalUsers[randomUserIndex].id

        if (!assignedUserIds.includes(randomUserId)) {
          assignedUserIds.push(randomUserId)
          return randomUserId
        } else {
          return getRandomUserId()
        }
      }

      function getRandomPostId () {
        const randomPostIndex = Math.floor(Math.random() * currentPosts.length)
        const randomPostId = currentPosts[randomPostIndex].id

        if (!assignedPostIds.includes(randomPostId)) {
          assignedPostIds.push(randomPostId)
          return randomPostId
        } else {
          return getRandomPostId()
        }
      }

      const favorite = {
        UserId: getRandomUserId(),
        PostId: getRandomPostId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      favorites.push(favorite)
    }

    await queryInterface.bulkInsert('Favorites', favorites, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Favorites', {})
  }
}
