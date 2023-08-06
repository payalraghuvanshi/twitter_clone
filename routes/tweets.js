const express = require('express')
const multer = require('multer');
const postController = require('../controller/user/post.controller');
const authMiddleware = require('../middleware/authMiddleware')
const {
    userPostSchema,
    editPost
  } = require('../controller/user/post.validator')

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/posts",authMiddleware,upload.single('image'),userPostSchema,postController.userPost);
router.get("/tweets", authMiddleware, postController.getPosts);
router.put('/posts/:postId', authMiddleware, editPost,postController.editPost);
router.delete("/delete-post/:postId",authMiddleware, postController.deletePost)
router.post("/follow", authMiddleware, postController.followUser);
router.post("/unfollow",authMiddleware, postController.unfollowUser)
router.get("/followed-user",authMiddleware, postController.getUserPostsOfFollowedUsers)
router.get("/explore-user",authMiddleware, postController.exploreUsers)




module.exports = router;



