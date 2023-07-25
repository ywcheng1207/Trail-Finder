'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' })
      Post.hasMany(models.Like, { foreignKey: 'postId' })
    }
  }
  Post.init({
    title: DataTypes.STRING,
    category: DataTypes.STRING,
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
  });
  return Post;
};