'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Trail extends Model {
    static associate (models) {
      Trail.belongsTo(models.User, { foreignKey: 'userId' })
      Trail.hasMany(models.Condition, { foreignKey: 'trailId' })
      Trail.hasMany(models.Favorite, { foreignKey: 'trailId' })
    }
  }
  Trail.init({
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    gpx: DataTypes.JSON,
    image: DataTypes.STRING,
    startingPoint: DataTypes.STRING,
    track: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    introduction: DataTypes.TEXT,
    location: DataTypes.STRING,
    distance: DataTypes.STRING,
    trailType: DataTypes.STRING,
    trailFormat: DataTypes.STRING,
    altitude: DataTypes.STRING,
    heightDiff: DataTypes.STRING,
    trailCondition: DataTypes.STRING,
    duration: DataTypes.STRING,
    difficulty: DataTypes.STRING,
    parkOwnership: DataTypes.STRING,
    permitRequiredForEntry: DataTypes.STRING,
    permitRequiredForParkAccess: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Trail',
    tableName: 'Trails'
  })
  return Trail
}
