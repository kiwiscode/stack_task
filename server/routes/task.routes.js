const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const mongoose = require("mongoose");
router.post("/", authenticateToken, (req, res) => {
  const { category, task } = req.body;
  const userId = req.user.userId;
  console.log(userId);
  console.log("Category : ", category);
  console.log("Task : ", task);

  User.findByIdAndUpdate(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newTask = {
        category: category,
        task: task,
      };

      user.list.push(newTask);

      return user.save();
    })
    .then(() => {
      console.log("User ID: ", userId);
      console.log("Category: ", category);
      console.log("Task: ", task);

      res.sendStatus(200);
    })
    .catch((error) => {
      console.error("Error adding task to user's list:", error);
      res.sendStatus(500);
    });
});

module.exports = router;
