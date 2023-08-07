# Twitter Clone

## The Twitter Clone - Node.js Backend (Express.js, PostgreSQL, Sequelize)

## Overview
This GitHub repository houses the backend for a Twitter Clone application, built using Node.js as the backend technology and PostgreSQL with Sequelize ORM as the database. The project features a complete authentication system, allowing users to sign up, sign in, and sign out securely. Users can create, read, update, and delete tweets, as well as follow and unfollow other users. The application offers a seamless user experience by displaying a user's own tweets and the tweets of the users they follow in a personalized feed.

## Key Features
- **User Authentication:** The application provides a robust authentication system, allowing users to sign up, sign in, and sign out securely.
- **Tweet Functionality:** Users can create, read, update, and delete tweets, enabling them to share their thoughts and updates with the community.
- **Follow and Unfollow:** Users can follow and unfollow other users, building connections and customizing their timeline.
- **Personalized Feed:** The platform fetches and displays a user's own tweets and the tweets of those they follow, providing a personalized feed with the latest updates.

## Installation
To run the Twitter Clone backend locally, follow these steps:

1. Clone this repository to your local machine using `git clone <repository-url>`.
2. Install the required dependencies by running `npm install`.
3. Set up the PostgreSQL database and update the configuration in `config/config.js`.
4. Run the migrations to create the necessary tables using `npx sequelize-cli db:migrate`.
5. Start the application by running `npm start`.

## Usage
Once the backend is up and running, you can use the following endpoints to interact with the Twitter Clone:
-`POST /resister`: Register new user.
-`POST /login`: Login user.
-`POST /logout`: Logout user.
- `POST /posts`: Create a new post.
- `GET /tweets`: Fetch all posts.
- `PUT /posts/:postId`: Edit a specific post.
- `DELETE /delete-post/:postId`: Delete a specific post.
- `POST /follow`: Follow a user.
- `POST /unfollow`: Unfollow a user.
- `GET /followed-user`: Get tweets of followed users.
- `GET /explore-user`: Explore other users.
- `POST /forgot-password`: Request password reset for a user.
- `POST /reset-password/:token`: Reset the password using the reset token.
- `GET /get-user`: Get all users.


