import axios from 'axios';

// Base API URL with fallback for local development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response?.data) {
      const data = error.response.data;
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.join(' | ');
      } else if (data.message) {
        errorMessage = data.message;
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to the backend server. Make sure MongoDB and Node server are running.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export const taskService = {
  /**
   * Fetch all tasks with optional filters
   * @param {Object} params - { search, status, priority, sortBy, order }
   */
  getTasks: async (params = {}) => {
    return apiClient.get('/tasks', { params });
  },

  /**
   * Fetch a single task by ID
   * @param {string} id
   */
  getTaskById: async (id) => {
    return apiClient.get(`/tasks/${id}`);
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, status, priority }
   */
  createTask: async (taskData) => {
    return apiClient.post('/tasks', taskData);
  },

  /**
   * Update an existing task by ID
   * @param {string} id
   * @param {Object} taskData
   */
  updateTask: async (id, taskData) => {
    return apiClient.put(`/tasks/${id}`, taskData);
  },

  /**
   * Delete a task by ID
   * @param {string} id
   */
  deleteTask: async (id) => {
    return apiClient.delete(`/tasks/${id}`);
  },

  /**
   * Fetch summary statistics
   */
  getTaskStats: async () => {
    return apiClient.get('/tasks/stats/summary');
  },
};

export default taskService;
