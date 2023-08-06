// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Make sure the correct path is provided to the User model

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user by userId in the database
    const user = await User.findOne({ where: { userId: decodedToken.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach the user data to the request object
    req.user = {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePic: user.profilePic,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
