const express = require("express");
const router = express.Router();
const admin = require("../config/admin");
router.post("/login", (req, res) => {
  const { email, password, secretKey } = req.body;
  if (
    email === admin.email &&
    password === admin.password &&
    secretKey === admin.secretKey
  ) {
    return res.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
      },
      token: "admin-token-123", 
    });
  }
  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});
module.exports = router;