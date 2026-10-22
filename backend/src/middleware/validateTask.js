/**
 * Request validation middleware for Task creation and updates
 */
const validateTaskInput = (req, res, next) => {
  const { title, description, status, priority } = req.body;
  const errors = [];

  // When creating (POST), title is strictly required
  if (req.method === 'POST') {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title is required and cannot be empty.');
    }
  }

  // When updating (PUT), if title is explicitly passed, it must not be empty
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Task title must be a non-empty string.');
    } else if (title.trim().length > 150) {
      errors.push('Task title cannot exceed 150 characters.');
    }
  }

  // Validate description if provided
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string.');
    } else if (description.trim().length > 1000) {
      errors.push('Description cannot exceed 1000 characters.');
    }
  }

  // Validate status if provided
  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate priority if provided
  const validPriorities = ['Low', 'Medium', 'High'];
  if (priority !== undefined && !validPriorities.includes(priority)) {
    errors.push(`Invalid priority '${priority}'. Must be one of: ${validPriorities.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize trimmed strings
  if (typeof req.body.title === 'string') {
    req.body.title = req.body.title.trim();
  }
  if (typeof req.body.description === 'string') {
    req.body.description = req.body.description.trim();
  }

  next();
};

module.exports = { validateTaskInput };
