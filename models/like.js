'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'userId' })
      Like.belongsTo(models.Post, { foreignKey: 'postId' })
    }
  };
  Like.init({
    UserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
  return Like
}
