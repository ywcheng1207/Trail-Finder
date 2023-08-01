const adminServices = require('../../services/admin-services')

const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getAllUsers: (req, res, next) => {
    adminServices.getAllUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}

module.exports = adminController