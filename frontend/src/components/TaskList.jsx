import React from 'react';
import TaskCard from './TaskCard';
import { AlertCircle, Plus, SearchX, Inbox } from 'lucide-react';

export default function TaskList({
  tasks,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal,
  isFiltered,
}) {
  // Loading skeleton state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse flex flex-col justify-between h-56"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
                <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
              </div>
              <div className="h-5 w-3/4 bg-slate-200 rounded mb-2.5"></div>
              <div className="h-4 w-full bg-slate-100 rounded mb-1.5"></div>
              <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-7 w-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 text-center max-w-lg mx-auto my-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h4 className="font-bold text-base mb-1">Failed to Load Tasks</h4>
        <p className="text-sm text-rose-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto my-6">
        {isFiltered ? (
          <>
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Matching Tasks</h3>
            <p className="text-sm text-slate-500 mb-6">
              We couldn't find any tasks matching your active search or filters. Try adjusting your query or resetting filters.
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No Tasks Found</h3>
            <p className="text-sm text-slate-500 mb-6">
              Your task board is completely clear! Create your first task to start organizing your workflow.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Your First Task</span>
            </button>
          </>
        )}
      </div>
    );
  }

  // Populated task grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard
          key={task.id || task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
