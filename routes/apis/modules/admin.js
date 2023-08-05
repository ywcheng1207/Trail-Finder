const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/apis/admin-controller')

router.delete('/posts/:postId', adminController.deletePost)
router.post('/:userId/notify', adminController.sendNotify)
router.get('/users/suspension', adminController.getAllSuspension)
router.put('/suspend', adminController.addSuspension)
router.put('/unsuspend', adminController.removeSuspension)
router.get('/users', adminController.getAllUsers)

router.use('/', (req, res) => res.send('this is admin page.'))

module.exports = router
