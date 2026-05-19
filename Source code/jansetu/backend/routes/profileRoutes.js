const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
router.get("/", protect, getProfile);
router.put(
  "/",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "voterImage", maxCount: 1 }
  ]),updateProfile
);
router.put("/change-password", protect, changePassword);
module.exports = router;