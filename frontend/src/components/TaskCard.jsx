import React from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Loader2,
  Flag,
} from 'lucide-react';

const statusConfig = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    icon: Clock,
    dot: 'bg-amber-500',
  },
  'In Progress': {
    bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    icon: Loader2,
    dot: 'bg-sky-500',
  },
  Completed: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
  },
};

const priorityConfig = {
  Low: {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: 'text-slate-400',
  },
  Medium: {
    bg: 'bg-amber-100/70 text-amber-800 border-amber-200',
    iconColor: 'text-amber-500',
  },
  High: {
    bg: 'bg-rose-100/70 text-rose-800 border-rose-200',
    iconColor: 'text-rose-500',
  },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const statusMeta = statusConfig[task.status] || statusConfig.Pending;
  const priorityMeta = priorityConfig[task.priority] || priorityConfig.Medium;
  const isCompleted = task.status === 'Completed';

  // Format date
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:border-slate-300 ${
        isCompleted ? 'border-slate-200/60 bg-slate-50/50' : 'border-slate-200'
      }`}
    >
      <div>
        {/* Header Badges: Priority & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Priority Pill */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${priorityMeta.bg}`}
          >
            <Flag className={`w-3 h-3 ${priorityMeta.iconColor} fill-current`} />
            <span>{task.priority} Priority</span>
          </div>

          {/* Quick Status Selector */}
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border appearance-none pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 transition ${statusMeta.bg}`}
              title="Click to quickly change status"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-current opacity-70">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Task Title */}
        <h3
          className={`text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-2 ${
            isCompleted ? 'line-through text-slate-400' : ''
          }`}
          title={task.title}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description ? (
          <p
            className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
              isCompleted ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {task.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">No description provided.</p>
        )}
      </div>

      {/* Footer: Date and Action Buttons */}
      <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
