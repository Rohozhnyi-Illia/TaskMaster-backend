const mongoose = require('mongoose')

const TaskModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Done', 'In-progress', 'Archived', 'Blocked'],
      required: true,
    },
    category: {
      type: String,
      enum: ['High', 'Middle', 'Low'],
      required: true,
    },
    deadline: { type: Date, required: true },
    remainingTime: { type: Number, default: 24 },
    timeTracker: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Task', TaskModel)
