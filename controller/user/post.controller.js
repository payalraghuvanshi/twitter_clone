const fs = require('fs');
const path = require('path');
const Modal = require('../../models/index');
const User = Modal.User
const Post = Modal.Posts

const userPost = async (req, res) => {
    const { description } = req.body;
    const email = req.user.email;
    try {
        // Fetch the user data from the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const fullName = `${user.firstName} ${user.lastName}`;
        const userProfile = user.profilePic || null;

        // Create a new post record in the database
        const post = await Post.create({
            image: "",
            description,
            user_id: user.userId,
            fullName: fullName,
            profilePic: userProfile,
        });

        let imageUrl = null;

        if (req.file) {
            // Save the image file to the server
            const timestamp = Date.now();
            const filename = `${timestamp}.png`;
            fs.writeFileSync(path.join(__dirname, '../../public/userPost', filename), req.file.buffer);

            // Upload the image to the database and get the URL
            imageUrl = filename;
            post.image = imageUrl
        }

        res.status(200).json({ message: 'Post created successfully!', data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getPosts = async (req, res) => {
    try {
        const email = req.user.email;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find all posts by users other than the current user and order by created_at in descending order
        const posts = await Post.findAll({
            where: {
                user_id: {
                    [Op.not]: user.userId,
                },
            },
            order: [['created_at', 'DESC']],
        });

        // Return the posts data
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editPost = async (req, res) => {
    const { postId } = req.params;
    const { description } = req.body;
    const email = req.user.email;

    try {
        // Find the user data from the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the post by post ID
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user is the owner of the post
        if (post.user_id !== user.userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this post' });
        }

        // Update the post description
        post.description = description;

        if (req.file) {
            // Save the new image file to the server
            const timestamp = Date.now();
            const filename = `${timestamp}.png`;
            fs.writeFileSync(path.join(__dirname, '../../public/userPost', filename), req.file.buffer);

            // Delete the old image from the server
            if (post.image) {
                fs.unlinkSync(path.join(__dirname, '../../public/userPost', post.image));
            }

            // Update the post image URL in the database
            post.image = filename;
        }

        await post.save();

        res.status(200).json({ message: 'Post updated successfully!', data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    const { postId } = req.params;
    const email = req.user.email;

    try {
        // Find the user data from the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the post by post ID
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user is the owner of the post
        if (post.user_id !== user.userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this post' });
        }

        // Delete the image file from the server if it exists
        if (post.image) {
            fs.unlinkSync(path.join(__dirname, '../../public/userPost', post.image));
        }

        // Delete the post from the database
        await post.destroy();

        res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const followUser = async (req, res) => {
    const currentUserEmail = req.user.email; // Email of the current user
    const { userId } = req.body; // ID of the user to follow

    try {
        // Find the current user by email
        const currentUser = await User.findOne({ where: { email: currentUserEmail } });
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const currentUserId = currentUser.userId;
        const followingIds = currentUser.following_id ? currentUser.following_id : [];

        // Find the user to follow by userId
        const userToFollow = await User.findOne({ where: { userId } });
        if (!userToFollow) {
            return res.status(404).json({ error: 'User to follow not found' });
        }

        const userToFollowId = userToFollow.userId;
        const followersIds = userToFollow.followers_id ? userToFollow.followers_id : [];
        const followingIdsOfUserToFollow = userToFollow.following_id ? userToFollow.following_id : [];

        // Check if the current user is already following the specified user and vice versa
        const isFollowing = followingIds.includes(userToFollowId);
        const isFollowedByUserToFollow = followingIdsOfUserToFollow.includes(currentUserId);

        // Update the current user's followingIds array only if they are not already following
        if (!isFollowing) {
            followingIds.push(userToFollowId);
            await currentUser.update({ following_id: followingIds });
        }

        // Update the user being followed's followersIds array only if they are not already following the current user
        if (!isFollowedByUserToFollow) {
            followersIds.push(currentUserId);
            await userToFollow.update({ followers_id: followersIds });
        }

        res.status(200).json({ followStatus: !isFollowing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const unfollowUser = async (req, res) => {
    const currentUserEmail = req.user.email; // Email of the current user
    const { userId } = req.body; // ID of the user to unfollow

    try {
        // Find the current user by email
        const currentUser = await User.findOne({ where: { email: currentUserEmail } });
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const currentUserId = currentUser.userId;
        const followingIds = currentUser.following_id ? currentUser.following_id : [];

        // Find the user to unfollow by userId
        const userToUnfollow = await User.findOne({ where: { userId } });
        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User to unfollow not found' });
        }

        const userToUnfollowId = userToUnfollow.userId;
        const followersIds = userToUnfollow.followers_id ? userToUnfollow.followers_id : [];
        const followingIdsOfUserToUnfollow = userToUnfollow.following_id ? userToUnfollow.following_id : [];

        // Check if the current user is following the specified user and vice versa
        const isFollowing = followingIds.includes(userToUnfollowId);
        const isFollowedByUserToUnfollow = followingIdsOfUserToUnfollow.includes(currentUserId);

        // Update the current user's followingIds array only if they are following the specified user
        if (isFollowing) {
            const updatedFollowingIds = followingIds.filter(id => id !== userToUnfollowId);
            await currentUser.update({ following_id: updatedFollowingIds });
        }

        // Update the user being unfollowed's followersIds array only if they are followed by the current user
        if (isFollowedByUserToUnfollow) {
            const updatedFollowersIds = followersIds.filter(id => id !== currentUserId);
            await userToUnfollow.update({ followers_id: updatedFollowersIds });
        }

        res.status(200).json({ followStatus: false }); // Set followStatus to false as the user is now unfollowed
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserPostsOfFollowedUsers = async (req, res) => {
    const currentUserEmail = req.user.email; // Email of the current user

    try {
        // Find the current user by email
        const currentUser = await User.findOne({ where: { email: currentUserEmail } });
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const currentUserId = currentUser.userId;
        const followingIds = currentUser.following_id ? currentUser.following_id : [];

        // Fetch posts from users who are followed by the current user and the current user's own posts
        const userPosts = await Post.findAll({
            where: {
                [Op.or]: [
                    { user_id: currentUserId }, // Include the current user's posts
                    { user_id: followingIds }, // Include posts from followed users
                ],
            },
            order: [['created_at', 'DESC']],
        });

        res.status(200).json({ posts: userPosts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const exploreUsers = async (req, res) => {
    const currentUserEmail = req.user.email; // Email of the current user

    try {
        // Find the current user by email
        const currentUser = await User.findOne({ where: { email: currentUserEmail } });
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const currentUserId = currentUser.userId;
        const followingIds = currentUser.following_id ? currentUser.following_id : [];

        // Fetch all user IDs
        const allUsers = await User.findAll({ attributes: ['userId'] });

        // Filter out user IDs that are not followed by the current user
        const unfollowedUserIds = allUsers
            .filter((user) => user.userId !== currentUserId && !followingIds.includes(user.userId))
            .map((user) => user.userId);

        // Fetch posts from users who are not followed by the current user
        const userPosts = await Post.findAll({
            where: {
                user_id: unfollowedUserIds,
            },
            order: [['created_at', 'DESC']],
        });

        res.status(200).json({ posts: userPosts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { userPost, getPosts, followUser, unfollowUser, getUserPostsOfFollowedUsers, exploreUsers, editPost, deletePost };
