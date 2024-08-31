const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const User = require("../models/User.model");
const Task = require("../models/Task.model");
const CompletedTask = require("../models/CompletedTask.model");
const capitalize = require("../helpers/capitalize");

// add task
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { task, status, category, startDate, endDate } =
      req.body.newTaskFormData;

    const { userId } = req.user;

    const taskData = {
      task,
      status,
      category,
      startDate,
      endDate,
      user: userId,
    };

    let savedTask;

    if (status === "completed") {
      const newCompletedTask = new CompletedTask(taskData);
      savedTask = await newCompletedTask.save();
    } else if (["in-progress", "todo"].includes(status)) {
      const newTask = new Task(taskData);
      savedTask = await newTask.save();
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("error:", error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
});

// get tasks
router.get("/all-tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get in-progress tasks
router.get("/in-progress", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.userId,
      status: "in-progress",
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// get completed tasks
router.get("/completed", authenticateToken, async (req, res) => {
  try {
    const tasks = await CompletedTask.find({
      user: req.user.userId,
      status: "completed",
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// complete the task and add it to completed tasks by its taskId
router.put("/complete/:taskId", authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;

    console.log("task id to complete:", taskId);

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const completedTask = new CompletedTask({
      task: task.task,
      status: "completed",
      user: task.user,
      category: task.category,
      startDate: task.startDate,
      endDate: task.endDate,
    });

    await completedTask.save();

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: "Task completed and moved to completed tasks",
      completedTask,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Failed to complete task", error: error.message });
  }
});

// delete a task by its taskId
router.delete("/delete/:taskId", authenticateToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
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
