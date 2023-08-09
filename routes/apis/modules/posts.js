const express = require('express')
const router = express.Router()

const postController = require('../../../controllers/apis/post-controller')

const { authenticated, optionalAuthenticated } = require('../../../middleware/auth')


router.get('/:postId', optionalAuthenticated, postController.getPost)
router.get('/', optionalAuthenticated, postController.getPosts)

const upload = require('../../../middleware/multer')

router.delete('/collects/:postId', postController.deleteCollect)
router.delete('/likes/:postId', postController.deleteLike)
router.get('/users/all', authenticated, postController.getUserAllPosts)
router.get('/users/:postId', postController.getUserPost)
router.post('/report', postController.addReport)
router.get('/search', postController.searchPostByKeyword)
router.post('/collects', postController.addCollect)
router.post('/likes', postController.addLike)
router.post('/cache', upload.single('image'), postController.postTempPost)
router.get('/:postId', postController.getPost)
router.put('/:postId', upload.single('image'), postController.editPost)
router.delete('/:postId', postController.deletePost)
router.post('/', upload.single('image'), postController.postPost)

router.use('/', (req, res) => res.send('this is post page.'))

module.exports = router
