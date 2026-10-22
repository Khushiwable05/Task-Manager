const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/task.controller');
const { validateTaskInput } = require('../middleware/validateTask');

// Aggregate statistics route (defined before :id parameter)
router.get('/stats/summary', getTaskStats);

// Main CRUD routes
router
  .route('/')
  .get(getTasks)
  .post(validateTaskInput, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(validateTaskInput, updateTask)
  .delete(deleteTask);

module.exports = router;
