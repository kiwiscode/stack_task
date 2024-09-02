const { Schema, model } = require("mongoose");

const completedTaskSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
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
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CompletedTask = model("CompletedTask", completedTaskSchema);

module.exports = CompletedTask;