const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { 
  createComplaint, 
  getAllComplaints,
  getComplaintsByUser,
  getByCategory,
  updateStatus,
  getCategoryStats,
  getMonthlyStats,
  deleteComplaint,
  getComplaintByNumber 
} = require("../controllers/complaintController");
const upload = require("../middleware/upload");
router.post("/create", protect, upload.single("image"), createComplaint);
router.get("/all", getAllComplaints);
router.get("/user", protect, getComplaintsByUser);
router.delete("/:id", protect, deleteComplaint);
router.get("/track/:complaintNumber", protect, getComplaintByNumber);
router.get("/category/:category", getByCategory);
router.put("/status/:id", updateStatus);
router.get("/category-stats", getCategoryStats);
router.get("/monthly-stats", getMonthlyStats);
module.exports = router;