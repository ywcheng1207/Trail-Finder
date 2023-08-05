const express = require('express')
const router = express.Router()

const postController = require('../../../controllers/apis/post-controller')
const upload = require('../../../middleware/multer')

router.get('/:postId/cache', postController.getTempPost)
router.get('/all', postController.getAllPosts)
router.post('/report', postController.addReport)
router.get('/:postId', postController.getPost)
router.post('/cache', upload.single('image'), postController.postTempPost)
router.post('/', upload.single('image'), postController.postPost)
router.get('/', postController.getPosts)

router.use('/', (req, res) => res.send('this is post page.'))

module.exports = router
