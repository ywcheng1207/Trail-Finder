const userServices = require('../../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data}))
  },
  getUserData: (req, res, next) => {
    userServices.getUserData(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}

module.exports = userController