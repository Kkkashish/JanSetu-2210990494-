const User = require("./userModel");
const Complaint = require("./complaintModel");
const Profile = require("./profileModel");


User.hasMany(Complaint, { foreignKey: "userId" });
Complaint.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, Complaint, Profile };