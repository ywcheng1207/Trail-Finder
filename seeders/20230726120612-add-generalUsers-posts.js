'use strict'

const faker = require('faker')
const { User, Sequelize } = require('../models')
const Op = Sequelize.Op

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 創建五篇心得貼文並隨機指派給一般(非幽靈)使用者
    const posts = []
    const categories = ['百岳', '郊山', '海外']
    const generalUsers = await User.findAll({
      where: {
        name: {
          [Op.like]: '%user%'
        }
      }
    })
    const assignedUserIds = []

    for (let i = 0; i < 5; i++) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomDifficulty = Math.floor(Math.random() * 5) + 1
      const randomRecommend = Math.floor(Math.random() * 5) + 1
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

      const post = {
        title: `Post ${i + 1}`,
        category: randomCategory,
        description: faker.lorem.paragraph(),
        image: `https://loremflickr.com/640/480/mountain/?lock=${Math.random() * 100}`,
        difficulty: randomDifficulty,
        recommend: randomRecommend,
        inProgress: false,
        UserId: getRandomUserId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      posts.push(post)
    }

    await queryInterface.bulkInsert('Posts', posts)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Posts', {})
  }
}
