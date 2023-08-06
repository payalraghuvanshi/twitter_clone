const express = require('express')
const multer = require('multer');
const postController = require('../controller/user/post.controller');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/posts",authMiddleware,upload.single('image'),postController.userPost);
router.get("/tweets", authMiddleware, postController.getPosts);
router.put('/posts/:postId', authMiddleware, postController.editPost);
router.get("/delete-post",authMiddleware, postController.deletePost)
router.post("/follow", authMiddleware, postController.followUser);
router.post("/unfollow",authMiddleware, postController.unfollowUser)
router.get("/followed-user",authMiddleware, postController.getUserPostsOfFollowedUsers)
router.get("/explore-user",authMiddleware, postController.exploreUsers)




module.exports = router;



