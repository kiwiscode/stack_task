const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Task = require("../models/Task.model");
const CompletedTask = require("../models/CompletedTask.model");
const authenticateToken = require("../middleware/jwtMiddleware");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          resolve(decoded);
        }
      });
    });

    const userId = decoded.userId;

    await User.findByIdAndUpdate(userId, { active: false });
    await Task.deleteMany({
      user: userId,
      $or: [{ deleted: true }, { completed: true }],
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error in logout:", error);
    res
      .status(500)
      .json({ message: "Error during logout", error: error.message });
  }
});

module.exports = router;
