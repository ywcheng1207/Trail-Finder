const express = require('express')
const router = express.Router()

const postController = require('../../../controllers/apis/post-controller')
const upload = require('../../../middleware/multer')
const { authenticated, optionalAuthenticated } = require('../../../middleware/auth')

router.delete('/collects/:postId', authenticated, postController.deleteCollect)
router.delete('/likes/:postId', authenticated, postController.deleteLike)
router.get('/users/:postId', authenticated, postController.getUserPost)
router.get('/all', optionalAuthenticated, postController.getUserAllPosts)
router.post('/report', authenticated, postController.addReport)
router.get('/search', optionalAuthenticated, postController.searchPostByKeyword)
router.get('/:postId', optionalAuthenticated, postController.getPost)
router.post('/collects', authenticated, postController.addCollect)
router.post('/likes', authenticated, postController.addLike)
router.post('/cache', authenticated, upload.single('image'), postController.postTempPost)
router.put('/:postId', authenticated, upload.single('image'), postController.editPost)
router.delete('/:postId', authenticated, postController.deletePost)
router.get('/', optionalAuthenticated, postController.getPosts)
router.post('/', authenticated, upload.single('image'), postController.postPost)

router.use('/', (req, res) => res.send('this is post page.'))

module.exports = router
