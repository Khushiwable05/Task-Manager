import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import taskService from './api/taskService';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Search State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch tasks and statistics
  const fetchTasksData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        sortBy,
        order,
      };
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (status !== 'All') params.status = status;
      if (priority !== 'All') params.priority = priority;

      const [tasksRes, statsRes] = await Promise.allSettled([
        taskService.getTasks(params),
        taskService.getTaskStats(),
      ]);

      if (tasksRes.status === 'fulfilled') {
        setTasks(tasksRes.value.data || []);
      } else {
        throw tasksRes.reason;
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      } else {
        // Fallback: calculate stats locally from loaded tasks
        const all = tasksRes.value.data || [];
        setStats({
          total: all.length,
          pending: all.filter((t) => t.status === 'Pending').length,
          inProgress: all.filter((t) => t.status === 'In Progress').length,
          completed: all.filter((t) => t.status === 'Completed').length,
        });
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to connect to the task server.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, priority, sortBy, order]);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  // Handle Create or Update submission
  const handleSaveTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const id = editingTask.id || editingTask._id;
        await taskService.updateTask(id, taskData);
        showToast('Task updated successfully!', 'success');
      } else {
        await taskService.createTask(taskData);
        showToast('New task created successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasksData();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Status Change from card dropdown
  const handleQuickStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;

    const taskId = task.id || task._id;
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => ((t.id || t._id) === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(taskId, { status: newStatus });
      showToast(`Status changed to ${newStatus}`, 'success');
      // Refresh stats quietly
      const statsRes = await taskService.getTaskStats().catch(() => null);
      if (statsRes?.data) setStats(statsRes.data);
    } catch (err) {
      // Revert on error
      showToast(err.message || 'Failed to update status', 'error');
      fetchTasksData();
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    const taskId = deletingTask.id || deletingTask._id;

    try {
      await taskService.deleteTask(taskId);
      showToast('Task deleted successfully!', 'success');
      setDeletingTask(null);
      fetchTasksData();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setSortBy('createdAt');
    setOrder('desc');
  };

  const isFiltered = Boolean(search || status !== 'All' || priority !== 'All');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold border ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white ml-2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        totalCount={stats.total}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Overview Statistics Cards */}
        <StatsOverview
          stats={stats}
          activeStatus={status}
          onSelectStatus={(selected) => {
            setStatus(selected);
          }}
        />

        {/* Filter & Search Toolbar */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          sortBy={sortBy}
          setSortBy={setSortBy}
          order={order}
          setOrder={setOrder}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Task Cards Grid View */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onRetry={fetchTasksData}
          onEdit={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
          onDelete={(task) => {
            setDeletingTask(task);
          }}
          onStatusChange={handleQuickStatusChange}
          onOpenCreateModal={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          isFiltered={isFiltered}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 TaskFlow App. Built with React, Tailwind CSS, Express & MongoDB.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> REST API Active
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialTask={editingTask}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteConfirm}
        task={deletingTask}
        isDeleting={isDeleting}
      />
    </div>
  );
}
