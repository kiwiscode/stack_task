const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "todo"],
      default: "todo",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["work", "personal", "family", "pet"],
      required: true,
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

module.exports = Task;
