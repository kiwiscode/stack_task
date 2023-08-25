const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
router.post("/", authenticateToken, (req, res) => {
  const { category, task, calendarDate, time, isCompleted } = req.body;
  const userId = req.user.userId;
  console.log(userId);
  console.log("Category : ", category);
  console.log("Task : ", task);
  console.log("Date : ", calendarDate);
  console.log("Time : ", time);
  console.log("Is completed ? : ", isCompleted);

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

      const newTask = {
        category: category,
        task: task,
        calendarDate: calendarDate,
        time: time,
        isCompleted: isCompleted,
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
  const taskList = req.body.taskList;

  console.log("List item to remove:", taskList);

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
  const { taskIndex, taskList } = req.body.data;

  console.log("Task Index:", taskIndex);
  console.log("Current Task List:", taskList);
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: "FAILED",
          message: "User not found",
        });
      }
      console.log("User List:", user.list);
      if (taskIndex < 0 || taskIndex >= user.list.length) {
        console.log("hello world");
        return res.status(400).json({
          status: "FAILED",
          message: "Invalid task index",
        });
      }

      const taskToUpdate = taskList[taskIndex];
      const userTaskIndex = user.list.findIndex(
        (userTask) => userTask.task === taskToUpdate.task
      );

      console.log("Is correct index ?:", userTaskIndex);
      console.log("Is correct item ?:", user.list[userTaskIndex]);

      const update = { $set: {} };
      update.$set[`list.${userTaskIndex}.isCompleted`] = true;

      return User.updateOne({ _id: userId }, update);
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

module.exports = router;
