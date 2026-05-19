const Complaint = require("../models/complaintModel");
const { Sequelize } = require("sequelize");
const translateToEnglish = require("../utils/translate");

// GENERATE COMPLAINT NUMBER
const generateComplaintNumber = async () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `JS-${random}`;
};

// DEPARTMENT MAPPING
   const departmentMap = {
  Medical: "Health Department",
  Crime: "Police",
  Electricity: "Electricity Board",
  Water: "Municipal Department",
  Sanitation: "Municipal Department",
  Roads: "Municipal Department",
  Others: "General"
};

// CREATE COMPLAINT
exports.createComplaint = async (req, res) => {
  try {
    const { name, phone, address, category, description } = req.body;

    if (!name || !phone || !address || !category || !description) {
      return res.status(400).json({ message: "All fields required" });
    }

    const image = req.file ? req.file.filename : null;
    const userId = req.user.id; 
     
    let translatedDescription;

    try {
      translatedDescription = await translateToEnglish(description);
    } catch (err) {
      console.log("Translation failed:", err.message);
      translatedDescription = description;
    }

    if (!translatedDescription) {
      translatedDescription = description;
    }

    const desc = translatedDescription.toLowerCase();

    const urgentWords = ["emergency", "urgent", "danger", "accident", "immediately"];
    let urgencyScore = 0;

    urgentWords.forEach(word => {
      if (desc.includes(word)) urgencyScore += 2;
    });

    const negativeWords = ["broken", "leak", "damage", "unsafe", "dangerous"];
    let sentimentScore = 0;

    negativeWords.forEach(word => {
      if (desc.includes(word)) sentimentScore += 1;
    });

    const categoryWeights = {
      Medical: 10,
      Crime: 9,
      Electricity: 8,
      Water: 8,
      Sanitation: 7,
      Roads: 6,
      Others: 4
    };

    const categoryScore = categoryWeights[category] || 4;

    const timeFactor = 0;

    const priority = Number((
      (0.4 * urgencyScore) +
      (0.3 * sentimentScore) +
      (0.2 * categoryScore) +
      (0.1 * timeFactor)
    ).toFixed(2));

    const department = departmentMap[category] || "General";

    let complaintNumber;
    let isUnique = false;

    while (!isUnique) {
      complaintNumber = await generateComplaintNumber();

      const existing = await Complaint.findOne({
        where: { complaintNumber }
      });

      if (!existing) isUnique = true;
    }

    const complaint = await Complaint.create({
      userId,
      name,
      phone,
      address,
      category,
      description,
      translatedDescription,
      image,
      priority,
      status: "Pending",
      department,
      complaintNumber
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL COMPLAINTS (ADMIN)
exports.getAllComplaints = async (req, res) => {
   try {
    const complaints = await Complaint.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({ message: "Server error while fetching complaints" });
  }
};

// GET COMPLAINTS BY USER 
exports.getComplaintsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("🔍 Logged in user:", userId);
    const complaints = await Complaint.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "complaintNumber", "status", "createdAt"]
    });

    console.log("📦 Complaints found:", complaints.length); 

    res.status(200).json(complaints);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// DELETE (WITHDRAW) COMPLAINT
   exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await complaint.destroy();

    res.status(200).json({
      message: "Complaint withdrawn successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET BY CATEGORY
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const complaints = await Complaint.findAll({
      where: { category }
    });

    res.status(200).json(complaints);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findByPk(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({
      message: "Status updated",
      complaint
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// CATEGORY STATS
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Complaint.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("category")), "count"]
      ],
      group: ["category"]
    });

    res.status(200).json(stats);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// MONTHLY STATS
exports.getMonthlyStats = async (req, res) => {
  try {
    const stats = await Complaint.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", "*"), "count"]
      ],
      group: ["month"]
    });

    res.status(200).json(stats);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//TRACK COMPLAINT 
exports.getComplaintByNumber = async (req, res) => {
  try {
    const { complaintNumber } = req.params;

    const complaint = await Complaint.findOne({
      where: {
        complaintNumber,
        userId: req.user.id 
      }
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found or not authorized"
      });
    }

    res.status(200).json(complaint);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET COMPLAINT BY NUMBER 
const getComplaintByNumber = async (req, res) => {
  try {
    const { complaintNumber } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const complaint = await Complaint.findOne({
      where: {
        complaintNumber,
        userId: req.user.id, 
      },
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Server error while fetching complaint" });
  }
};