const express = require('express')
const router = express.Router()

const trailController = require('../../../controllers/apis/trail-controller')

const { authenticated, optionalAuthenticated } = require('../../../middleware/auth')

router.post('/conditions/:trailId', authenticated, trailController.postCondition)
router.get('/conditions/:trailId', optionalAuthenticated, trailController.getConditions)
router.post('/favorites', authenticated, trailController.addFavoriteTrail)
router.get('/search', optionalAuthenticated, trailController.searchTrailByKeyword)
router.get('/:trailId', optionalAuthenticated, trailController.getTrail)
router.get('/', optionalAuthenticated, trailController.getAllTrails)

router.use('/', (req, res) => res.send('this is trail page.'))

module.exports = router
