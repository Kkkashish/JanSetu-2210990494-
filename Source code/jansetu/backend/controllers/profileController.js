const Profile = require("../models/profileModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
//GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    console.log("USER ID:", req.user?.id);
    let profile = await Profile.findOne({
      where: { userId: req.user.id }
    });
    if (!profile) {
      profile = await Profile.create({
        userId: req.user.id,
        phone: null,
        gender: null,
        voterId: null,
        location: null,
        profileImage: "default-profile.jpg",
        voterImage: null
        });
    }
    const fields = [
      profile.phone || "",
      profile.gender || "",
      profile.location || "",
      profile.voterId || "",
      profile.profileImage || ""
    ];
    const filled = fields.filter(f => f !== "").length;
    const completeness = Math.floor((filled / fields.length) * 100);
    res.status(200).json({
      profile,
      completeness
    });
  } catch (err) {
    console.log("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
//UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { phone, gender, voterId, location } = req.body;
    let profile = await Profile.findOne({
      where: { userId: req.user.id }
    });
    if (!profile) {
      profile = await Profile.create({ userId: req.user.id });
    }
    //validations
    if (phone && phone.length !== 10) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }
    if (voterId) {
    const epicRegex = /^[A-Z]{3}[0-9]{7}$/;
    if (!epicRegex.test(voterId)) {
        return res.status(400).json({
        message: "Invalid Voter ID format (Example: ABC1234567)"
        });
    }
    }
    if (phone && phone.length === 10) {profile.phone = phone;}
    if (gender) {profile.gender = gender;}
    if (location) {profile.location = location;}
    if (voterId) {profile.voterId = voterId;}
    console.log("FILES RECEIVED:", req.files); // always log once
    if (req.files && req.files.profileImage) {profile.profileImage = req.files.profileImage[0].filename;}
    if (req.files && req.files.voterImage) {profile.voterImage = req.files.voterImage[0].filename;}
    if (profile.phone === "") {profile.phone = null;}
    if (profile.voterId === "") {profile.voterId = null;}
    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
//CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};