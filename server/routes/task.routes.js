const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const capitalize = require("../helpers/capitalize");

router.post("/", authenticateToken, (req, res) => {
  const { category, calendarDate, time, isCompleted, completedFullDate } =
    req.body;
  console.log(calendarDate);
  let { task } = req.body;
  const userId = req.user.userId;
  task = capitalize(task);

  if (category === "" || task === "" || calendarDate === "" || time === "") {
    res.status(403).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide category, task, date and time.",
    });

    return;
  }

  User.findByIdAndUpdate(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      for (let i = 0; i < user.list.length; i++) {
        if (user.list[i].task === task) {
          return res.status(400).json({
            error:
              "Cannot add duplicate tasks. A task with the same name already exists.",
          });
        }
      }
      const newTask = {
        category: category,
        task: task,
        calendarDate: calendarDate,
        time: time,
        isCompleted: isCompleted,
        completedFullDate: completedFullDate,
      };

      user.list.push(newTask);
      return user.save().then(() => {
        res.status(200).json({ message: "Task added successfully." });
      });
    })
    .catch((error) => {
      console.error("Error adding task to user's list:", error);
      res.sendStatus(500);
    });
});

router.delete("/delete-all", authenticateToken, (req, res) => {
  User.updateOne({}, { $pull: { list: { isCompleted: false } } })
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

router.delete("/delete-all-completed-tasks", authenticateToken, (req, res) => {
  User.updateOne({}, { $pull: { list: { isCompleted: true } } })
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

router.post("/task-completed", authenticateToken, (req, res, next) => {
  const userId = req.user.userId;
  const { taskToComplete, completedFullDate } = req.body.data;

  User.findOneAndUpdate(
    { _id: userId, "list.task": taskToComplete.task },
    { $set: { "list.$.isCompleted": true } }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(400).json({
          status: "FAILED",
          message: "Task not found in user's list",
        });
      }
      let index;
      for (let i = 0; i < updatedUser.list.length; i++) {
        if (updatedUser.list[i].task === taskToComplete.task) {
          index = i;
        }
      }

      updatedUser.list[index].completedFullDate = completedFullDate;

      return updatedUser.save();
    })
    .then(() => {
      res.status(200).json({
        status: "SUCCESS",
        message: "Task completed successfully",
      });
    })
    .catch((error) => {
      console.error("Error updating task:", error);
      res.status(500).json({
        status: "FAILED",
        message: "An error occurred while completing the task",
      });
    });
});

router.delete("/delete-completed-task", authenticateToken, (req, res) => {
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
