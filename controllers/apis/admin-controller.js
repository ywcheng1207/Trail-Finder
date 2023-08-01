const adminServices = require('../../services/admin-services')

const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getAllUsers: (req, res, next) => {
    adminServices.getAllUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getAllSuspension: (req, res, next) => {
    adminServices.getAllSuspension(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  addSuspension: (req, res, next) => {
    adminServices.addSuspension(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeSuspension: (req, res, next) => {
    adminServices.removeSuspension(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}

module.exports = adminController