'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate (models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId' })
    }
  };
  Notification.init({
    notify: DataTypes.TEXT,
    isRead: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications'
  })
  return Notification
}
