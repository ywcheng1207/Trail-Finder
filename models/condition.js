'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Condition extends Model {
    static associate (models) {
      Condition.belongsTo(models.User, { foreignKey: 'userId' })
      Condition.belongsTo(models.Trail, { foreignKey: 'trailId' })
    }
  }
  Condition.init({
    description: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TrailId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Condition',
    tableName: 'Conditions'
  })
  return Condition
}
