const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../../../controllers/apis/user-controller')

router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

router.get('/facebook/callback', passport.authenticate('facebook'),userController.signIn)

module.exports = router
