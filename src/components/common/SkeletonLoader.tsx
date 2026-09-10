import React from 'react';

interface SkeletonLoaderProps {
  readonly rows?: number;
  readonly type?: 'table' | 'card' | 'line';
  readonly className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  rows = 4,
  type = 'line',
  className = '',
}) => {
  if (type === 'card') {
    return (
      <div
        className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse space-y-4 ${className}`}
        aria-busy="true"
        aria-label="Cargando contenido..."
      >
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div
        className={`w-full divide-y divide-slate-200 dark:divide-slate-800 animate-pulse ${className}`}
        aria-busy="true"
        aria-label="Cargando tabla..."
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="py-4 flex items-center justify-between gap-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 animate-pulse ${className}`}
      aria-busy="true"
      aria-label="Cargando datos..."
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 dark:bg-slate-800 rounded"
          style={{ width: `${Math.max(40, 100 - i * 15)}%` }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
