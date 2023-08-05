const userServices = require('../../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserPosts: (req, res, next) => {
    userServices.getUserPosts(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editUserData: (req, res, next) => {
    userServices.editUserData(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserData: (req, res, next) => {
    userServices.getUserData(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserFollowings: (req, res, next) => {
    userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserFollowers: (req, res, next) => {
    userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserFavoritePost: (req, res, next) => {
    userServices.getUserFavoritePost(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserNotifications: (req, res, next) => {
    userServices.getUserNotifications(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  isReadNotification: (req, res, next) => {
    userServices.isReadNotification(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController
