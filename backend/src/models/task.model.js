const mongoose = require('mongoose');

/**
 * Task Schema Definition
 * 
 * Fields:
 * - title: String, Required, trimmed
 * - description: String, Optional, trimmed
 * - status: Enum ['Pending', 'In Progress', 'Completed'], Default: 'Pending'
 * - priority: Enum ['Low', 'Medium', 'High'], Default: 'Medium'
 * - createdAt: Timestamp (Date)
 * - updatedAt: Timestamp (Date)
 */
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'In Progress', 'Completed'],
        message: '{VALUE} is not a valid status (allowed: Pending, In Progress, Completed)',
      },
      default: 'Pending',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority (allowed: Low, Medium, High)',
      },
      default: 'Medium',
      index: true,
    },
  },
  {
    timestamps: true, // Automatically provides createdAt & updatedAt
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Compound index for status, priority, and date query efficiency
TaskSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);
