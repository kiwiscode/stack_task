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
      deleted: false,
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
    const tasks = await Task.find({
      user: req.user.userId,
      deleted: false,
      completed: false,
    }).sort({
      createdAt: -1,
    });

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

// mark a task as completed by its taskId
router.patch("/complete/:taskId", authenticateToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed: true },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const completedTask = new CompletedTask({
      taskId,
      task: updatedTask.task,
      status: "completed",
      user: updatedTask.user,
      category: updatedTask.category,
      startDate: updatedTask.startDate,
      endDate: updatedTask.endDate,
    });

    await completedTask.save();

    return res
      .status(200)
      .json({ message: "Task marked as completed", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// undo the completion of a task by its taskId (mark as uncompleted)
router.patch("/uncomplete/:taskId", authenticateToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed: false },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    await CompletedTask.findOneAndDelete({ taskId: taskId });

    return res
      .status(200)
      .json({ message: "Task marked as uncompleted", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// soft delete a task by its taskId
router.patch("/delete/:taskId", authenticateToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { deleted: true },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task marked as deleted", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// undo soft delete of a task by its taskId
router.patch("/undo/:taskId", authenticateToken, async (req, res) => {
  const { taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { deleted: false },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task restored successfully", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-all", authenticateToken, (req, res) => {});

router.delete(
  "/delete-all-completed-tasks",
  authenticateToken,
  (req, res) => {}
);

router.delete("/delete-completed-task", authenticateToken, (req, res) => {});

module.exports = router;
