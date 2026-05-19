const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secretkey");
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user.get({ plain: true }); 
      next();
    } else {
      return res.status(401).json({ message: "No token, not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token failed" });
  }
};
module.exports = protect;