'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate (models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' })
      Post.hasMany(models.Like, { foreignKey: 'postId' })
      Post.hasMany(models.Report, { foreignKey: 'postId' })
      Post.hasMany(models.Favorite, { foreignKey: 'postId' })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    category: {
      type: DataTypes.ENUM('百岳', '郊山', '海外'),
      allowNull: false
    },
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    recommend: DataTypes.STRING,
    inProgress: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'Posts'
  })
  return Post
}
