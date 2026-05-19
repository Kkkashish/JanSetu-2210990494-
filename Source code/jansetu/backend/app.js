const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const User = require("./models/userModel");
const Complaint = require("./models/complaintModel");
const Profile = require("./models/profileModel");

require("./models/associations");

const Admin = require("./routes/adminRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const profileRoutes = require("./routes/profileRoutes");


app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", Admin); 


sequelize.authenticate()
  .then(() => console.log("Database Connected ✅"))
  .catch(err => console.error("DB Error:", err));

sequelize.sync({ alter: false, force: false })
  .then(() => console.log("Tables created ✅"))
  .catch(err => console.error("Sync Error:", err));

app.get("/", (req, res) => {
  res.send("JanSetu Backend Running ✅");
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running - http://localhost:${PORT}`);
});