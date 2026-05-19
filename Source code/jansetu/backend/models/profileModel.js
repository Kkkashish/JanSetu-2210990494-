const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Profile = sequelize.define("Profile", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

phone: {
  type: DataTypes.STRING,
  allowNull: true,
  validate: {
    isValidPhone(value) {
      if (value && value.length !== 10) {
        throw new Error("Phone must be 10 digits");
      }
    }
  }
},

  gender: {
    type: DataTypes.STRING,
  },

voterId: {
  type: DataTypes.STRING,
  allowNull: true,
  validate: {
    isValidVoter(value) {
      const epicRegex = /^[A-Z]{3}[0-9]{7}$/;
      if (value && !epicRegex.test(value)) {
        throw new Error("Invalid Voter ID format (ABC1234567)");
      }
    }
  }
},

  voterImage: {
    type: DataTypes.STRING,
  },

  location: {
    type: DataTypes.STRING,
  },

  profileImage: {
    type: DataTypes.STRING,
    defaultValue: "default-profile.jpg"
  }

}, {
  timestamps: true,
});

module.exports = Profile;