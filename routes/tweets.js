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

//user tweets

router.post("/posts",authMiddleware,upload.single('image'),userPostSchema,postController.userPost); //post tweets
router.get("/tweets", authMiddleware, postController.getPosts); //get all tweets
router.put('/posts/:postId', authMiddleware, editPost,postController.editPost);//edit tweets
router.delete("/delete-post/:postId",authMiddleware, postController.deletePost)//delete tweets
router.post("/follow", authMiddleware, postController.followUser);//follow user
router.post("/unfollow",authMiddleware, postController.unfollowUser)//unfollow user
router.get("/followed-user",authMiddleware, postController.getUserPostsOfFollowedUsers)//get post of users which current user following with there own tweets
router.get("/explore-user",authMiddleware, postController.exploreUsers)//explore user tweets who's not followed by current user




module.exports = router;



