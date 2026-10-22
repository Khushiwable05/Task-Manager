import React from 'react';
import { Layers, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ stats, activeStatus, onSelectStatus }) {
  const cards = [
    {
      id: 'All',
      title: 'Total Tasks',
      count: stats.total,
      icon: Layers,
      bgColor: 'bg-indigo-50/70 hover:bg-indigo-50',
      textColor: 'text-indigo-700',
      iconBg: 'bg-indigo-600 text-white',
      borderColor: activeStatus === 'All' ? 'ring-2 ring-indigo-600 border-transparent shadow-md' : 'border-slate-200/80',
    },
    {
      id: 'Pending',
      title: 'Pending',
      count: stats.pending,
      icon: Clock,
      bgColor: 'bg-amber-50/70 hover:bg-amber-50',
      textColor: 'text-amber-700',
      iconBg: 'bg-amber-500 text-white',
      borderColor: activeStatus === 'Pending' ? 'ring-2 ring-amber-500 border-transparent shadow-md' : 'border-slate-200/80',
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      count: stats.inProgress,
      icon: Loader2,
      bgColor: 'bg-sky-50/70 hover:bg-sky-50',
      textColor: 'text-sky-700',
      iconBg: 'bg-sky-500 text-white',
      borderColor: activeStatus === 'In Progress' ? 'ring-2 ring-sky-500 border-transparent shadow-md' : 'border-slate-200/80',
    },
    {
      id: 'Completed',
      title: 'Completed',
      count: stats.completed,
      icon: CheckCircle2,
      bgColor: 'bg-emerald-50/70 hover:bg-emerald-50',
      textColor: 'text-emerald-700',
      iconBg: 'bg-emerald-600 text-white',
      borderColor: activeStatus === 'Completed' ? 'ring-2 ring-emerald-600 border-transparent shadow-md' : 'border-slate-200/80',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none ${card.borderColor}`}
          >
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1">
                {card.title}
              </p>
              <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.textColor}`}>
                {card.count}
              </h3>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-sm ${card.iconBg}`}>
              <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${card.id === 'In Progress' ? 'animate-spin-slow' : ''}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
