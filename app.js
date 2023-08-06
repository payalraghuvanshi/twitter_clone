const express = require('express');
const env = require('dotenv')
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const session = require('express-session');
env.config();
const userRouter = require('./routes/auth')
const userPosts = require('./routes/tweets')
const port = process.env.APP_HOST

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Set the expiration time for the session cookie (e.g., 1 hour)
    expires: new Date(Date.now() + 3600000), // 1 hour in milliseconds
    httpOnly: true,
    secure: true, 
  },
}));

app.use(express.json());
app.use('/', userRouter);
app.use('/', userPosts)

app.listen(4000, () => {
  console.log(`Server is running on port ${port}`);
});
