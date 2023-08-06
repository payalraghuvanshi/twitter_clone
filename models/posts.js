// models/user.js

const { Model, DataTypes } = require('sequelize');
const { Posts } = require('.');

module.exports = (sequelize) => {
  class Posts extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Posts.init(
    {
      // Define model properties and data types here
      fullName: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      user_id: DataTypes.STRING,
      profilePic: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Posts',
    }
  );

  return Posts;
};
