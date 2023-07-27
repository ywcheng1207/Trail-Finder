'use strict'

const { User, Sequelize } = require('../models')
const Op = Sequelize.Op

module.exports = {
  async up (queryInterface, Sequelize) {
    const followshipMap = new Map()
    const usedFollowingIds = new Set()
    const generalUsers = await User.findAll({
      where: {
        name: {
          [Op.like]: '%user%'
        }
      }
    })

    function getFollowingId (generalUsers, followerId, usedFollowingIds) {
      let followingId = null
      while (followingId === null || followingId === followerId || usedFollowingIds.has(followingId)) {
        const randomIndex = Math.floor(Math.random() * generalUsers.length)
        followingId = generalUsers[randomIndex].id
      }
      return followingId
    }

    // 創造五筆一般使用者之間的followship
    for (let i = 0; i < generalUsers.length; i++) {
      const followerId = generalUsers[i].id
      const followingId = getFollowingId(generalUsers, followerId, usedFollowingIds)

      usedFollowingIds.add(followingId)

      if (followerId && followingId) {
        followshipMap.set(followerId, followingId)
      }
    }

    const followships = Array.from(followshipMap, ([followerId, followingId]) => ({
      followerId,
      followingId,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('Followships', followships, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Followships', {})
  }
}
