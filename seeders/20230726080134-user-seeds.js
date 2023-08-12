'use strict'

const bcrypt = require('bcryptjs')
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const admin = {
      // 一組admin
      name: 'root',
      email: 'root@example.com',
      password: await bcrypt.hash('1234', 10),
      avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
      introduction: "I'm admin.",
      role: 'admin',
      isSuspended: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const users = []
    // 5位一般使用者
    for (let i = 0; i < 5; i++) {
      const user = {
        name: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: await bcrypt.hash('12345678', 10),
        avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
        introduction: generateLimitedText(150),
        role: 'user',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      users.push(user)
    }

    const ghostUsers = []
    // 25位幽靈使用者
    for (let i = 0; i < 25; i++) {
      const ghostUser = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: await bcrypt.hash('12345678', 10),
        avatar: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 100)}`,
        introduction: generateLimitedText(150),
        role: 'user',
        isSuspended: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ghostUsers.push(ghostUser)
    }

    function generateLimitedText (maxLength) {
      const randomText = faker.lorem.text()
      const truncatedText = randomText.substring(0, maxLength)
      return truncatedText
    }

    await queryInterface.bulkInsert('Users', [admin])
    await queryInterface.bulkInsert('Users', users)
    await queryInterface.bulkInsert('Users', ghostUsers)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
