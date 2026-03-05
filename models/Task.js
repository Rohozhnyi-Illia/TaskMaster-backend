const mongoose = require('mongoose');

const TaskModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    task: {
      type: String,
      required: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Done', 'InProgress', 'Archived'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Critical', 'High', 'Middle', 'Low'],
      required: true,
    },
    deadline: { type: Date, required: true, immutable: true },
    remainingTime: { type: Number, default: 24, immutable: true },
    timeTracker: { type: Boolean, default: true, immutable: true },
    order: {
      type: Number,
      required: true,
    },
  },

  { timestamps: true },
);

module.exports = mongoose.model('Task', TaskModel);
