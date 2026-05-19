const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Complaint = sequelize.define("Complaint", {
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  translatedDescription: {
    type: DataTypes.TEXT,
  } ,

  image: {
    type: DataTypes.STRING,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },

  priority: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },

  department: {
    type: DataTypes.STRING,
    defaultValue: "General",
  },
  complaintNumber: {
    type: DataTypes.STRING,
    unique: true,
  }

}, {
  timestamps: true,
});

module.exports = Complaint;