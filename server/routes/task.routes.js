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
      deleted: false,
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
      deleted: false,
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

// delete all completed tasks for a user
router.delete(
  "/delete-completed-tasks/:userId",
  authenticateToken,
  async (req, res) => {
    const { userId } = req.params;

    try {
      // Tüm tamamlanmış görevleri sil
      const deleteResult = await CompletedTask.deleteMany({ user: userId });

      return res.status(200).json({
        message: `${deleteResult.deletedCount} completed tasks were deleted`,
        result: deleteResult,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// undo completed task
router.post(
  "/undo-completed/:completedTaskId",
  authenticateToken,
  async (req, res) => {
    const { completedTaskId } = req.params;

    try {
      // CompletedTask'ı bul
      const completedTask = await CompletedTask.findById(completedTaskId);
      if (!completedTask) {
        return res.status(404).send("Completed task not found");
      }

      // Task ID'yi kullanarak tasks koleksiyonunda arama yap
      let task = await Task.findById(completedTask.taskId);

      if (task) {
        // Eğer task varsa, durumu 'todo' olarak güncelle
        task.status = "todo";
        task.completed = false;
        await task.save();
      } else {
        // Eğer task yoksa, yeni bir task oluştur
        task = new Task({
          task: completedTask.task,
          status: "todo",
          user: completedTask.user,
          category: completedTask.category,
        });
        await task.save();
      }

      // CompletedTask'ı sil
      await CompletedTask.findByIdAndDelete(completedTaskId);

      res
        .status(200)
        .send("Task has been reverted to todo and completed task deleted");
    } catch (error) {
      console.error("Error undoing completed task:", error);
      res.status(500).send("Internal server error");
    }
  }
);

// soft delete a completed task by its taskId
router.patch(
  "/completed-tasks/delete/:completedTaskId",
  authenticateToken,
  async (req, res) => {
    const { completedTaskId } = req.params;

    try {
      const updatedTask = await CompletedTask.findByIdAndUpdate(
        completedTaskId,
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
  }
);

// undo soft delete of a completed task by its taskId
router.patch(
  "/completed-tasks/undo/:completedTaskId",
  authenticateToken,
  async (req, res) => {
    const { completedTaskId } = req.params;

    try {
      const updatedTask = await CompletedTask.findByIdAndUpdate(
        completedTaskId,
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
  }
);

module.exports = router;
