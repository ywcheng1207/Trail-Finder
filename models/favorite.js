'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate (models) {
      Favorite.belongsTo(models.User, { foreignKey: 'userId' })
      Favorite.belongsTo(models.Post, { foreignKey: 'postId' })
      Favorite.belongsTo(models.Trail, { foreignKey: 'trailId' })
    }
  }
  Favorite.init({
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    TrailId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'Favorites'
  })
  return Favorite
}
