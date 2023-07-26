'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
      User.hasMany(models.Report, { foreignKey: 'userId' })
      User.hasMany(models.Post, { foreignKey: 'userId' })
      User.hasMany(models.Like, { foreignKey: 'userId' })
      User.hasMany(models.Notification, { foreignKey: 'userId' })
      User.hasMany(models.Trail, { foreignKey: 'userId' })
      User.hasMany(models.Condition, { foreignKey: 'userId' })
      User.hasMany(models.Favorite, { foreignKey: 'userId' })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    isSuspended: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
