const express = require('express');
const env = require('dotenv')
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session');
env.config();
const userRouter = require('./routes/auth')
const userPosts = require('./routes/tweet')
const port = process.env.APP_HOST

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));
app.use(express.json());
app.use('/', userRouter);
app.use('/', userPosts)


app.listen(4000, () => {
  console.log(`Server is running on port ${port}`);
});