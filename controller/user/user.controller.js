const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')
const path = require('path')
const Modal = require('../../models/index');
const User = Modal.User


const env = require('dotenv')
env.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'payal.prakashinfo@gmail.com',
        pass: process.env.SMTP_PASS
    }
});



const signUp = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user record in the database
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userId: uuidv4(),
            followers_id: null,
            following_id: null,
        });

        if (req.file) {
            const timestamp = Date.now();
            const fileExt = path.extname(req.file.originalname);
            const fileName = `${timestamp}${fileExt}`;

            // Upload the file to the "public/profilePic" folder
            fs.writeFileSync(path.join(__dirname, '../../public/profilePic', fileName), req.file.buffer);

            // Update the user's profilePic column with the generated file path
            const userProfile = fileName;
            newUser.profilePic = userProfile;
            await newUser.save();
        }
        // Return the new user data
        res.status(201).json({ data: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email in the database
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Create a JWT token with the user data and secret key
        const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.SECRET_KEY);

        // Store the user data in the session
        req.session.user = {
            userId: user.userId,
            email: user.email,
        };
        // Set the cookie with the token
        res.cookie('auth_token', token, {
            maxAge: 3600000, // 1 hour in milliseconds
            httpOnly: true,
            secure: true,
        });

        res.status(200).json({
            message: 'Signed in successfully!',
            token,
            user: {
                userId: user.userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePic: user.profilePic
            },
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const signOut = (req, res) => {
    try {
        console.log(req.session);
        if (req.session) {
            req.session.destroy((err) => {
              if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Failed to log out' });
              }
        
            // Clear the cookie
            res.clearCookie('auth_token');
      
            // Respond with a success message
            res.status(200).json({ message: 'Logged out successfully!' });
          });
        } }catch (error) {
        res.status(500).json({ error: 'Failed to log out' });
    
}};


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const Frontend_URL = process.env.Frontend_URL;

        // Check if the user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // User with the provided email does not exist
            return res.status(404).json({ error: 'User not found' });
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        const resetLink = `${Frontend_URL}/reset-password/${token}`;
        const sub = 'Forgot Password';
        const body = `<div>Hello !!!</div><br/><div>You have requested to reset your password. Please click on the link below to enter a new password:</div><br/><div><a class="btn btn-primary" target="_blank" href="${resetLink}">Click Here to reset your password</a></div><br/><div>Please note that the link will expire in 1 hour.</div>`;

        const mailOptions = {
            from: 'payal.prakashinfo@gmail.com',
            to: email,
            subject: sub,
            html: body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Failed to send password reset email:', error);
                return res.status(500).json({ error: 'Failed to send password reset email' });
            } else {
                console.log(token, "token");
                console.log('Password reset email sent:', info.response);
                return res.status(200).json({ message: 'Password reset instructions sent via email' });
            }
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Verify the token and extract the email
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const email = decodedToken.email;

        // Generate a salt and hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password in the database
        const [numAffectedRows, affectedRows] = await User.update(
            { password: hashedPassword },
            { where: { email } }
        );

        if (numAffectedRows === 0) {
            // User with the provided email does not exist or token is invalid
            return res.status(404).json({ error: 'Invalid token' });
        }

        // Password reset successful
        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Used findAll to retrieve all users from the database
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = { signUp, signIn, signOut, forgetPassword, resetPassword, getUsers }
