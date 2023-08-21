const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
router.post("/", authenticateToken, (req, res) => {
  const { category, task, calendarDate, time } = req.body;
  const userId = req.user.userId;
  console.log(userId);
  console.log("Category : ", category);
  console.log("Task : ", task);
  console.log("Date : ", calendarDate);
  console.log("Time : ", time);

  User.findByIdAndUpdate(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newTask = {
        category: category,
        task: task,
        calendarDate: calendarDate,
        time: time,
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

router.delete("/delete-all", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  User.findByIdAndUpdate(userId, { $set: { list: [] } })
    .then(() => {
      res.json({
        status: "DONE",
        message: "TASKS DELETED",
      });
    })
    .catch((error) => {
      console.error("Error deleting tasks:", error);
      res.status(500).json({
        status: "FAILED",
        message: "An error occurred while deleting tasks",
      });
    });
});

router.delete("/delete-task", authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const taskToDelete = req.body.task;

  User.findById(userId)
    .then((user) => {
      user.list = user.list.filter((task) => task.task !== taskToDelete);
      return user.save();
    })
    .then(() => {
      res.json({
        status: "DONE",
        message: "TASKS DELETED",
      });
    })
    .catch((error) => {
      console.error("Error deleting tasks:", error);
      res.status(500).json({
        status: "FAILED",
        message: "An error occurred while deleting tasks",
      });
    });
});

module.exports = router;
