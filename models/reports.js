'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate (models) {
      Report.belongsTo(models.User, { foreignKey: 'userId' })
      Report.belongsTo(models.Post, { foreignKey: 'postId' })
    }
  }
  Report.init({
    content: DataTypes.TEXT,
    category: DataTypes.STRING,
    isSolved: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Report',
    tableName: 'Reports'
  })
  return Report
}
