// models/user.js

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  User.init(
    {
      // Define model properties and data types here
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profilePic: DataTypes.STRING,
      userId: DataTypes.STRING,
      followers_id: DataTypes.JSON,
      following_id: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
