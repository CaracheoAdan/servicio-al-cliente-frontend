import React from 'react';

interface SkeletonLoaderProps {
  type?: 'table' | 'card' | 'text' | 'form';
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'table', rows = 5 }) => {
  const getSkeletonClasses = () => {
    return 'animate-pulse bg-slate-200 dark:bg-slate-700/50 rounded-lg';
  };

  if (type === 'table') {
    return (
      <div className="w-full space-y-4">
        {/* Header row skeleton */}
        <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
          <div className={`h-6 flex-1 ${getSkeletonClasses()}`}></div>
          <div className={`h-6 flex-1 ${getSkeletonClasses()}`}></div>
          <div className={`h-6 flex-1 ${getSkeletonClasses()}`}></div>
          <div className={`h-6 w-24 ${getSkeletonClasses()}`}></div>
        </div>
        {/* Body rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            <div className={`h-5 flex-1 ${getSkeletonClasses()}`}></div>
            <div className={`h-5 flex-1 ${getSkeletonClasses()}`}></div>
            <div className={`h-5 flex-1 ${getSkeletonClasses()}`}></div>
            <div className={`h-5 w-24 ${getSkeletonClasses()}`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl space-y-4">
        <div className={`h-8 w-1/3 ${getSkeletonClasses()}`}></div>
        <div className={`h-4 w-full ${getSkeletonClasses()}`}></div>
        <div className={`h-4 w-2/3 ${getSkeletonClasses()}`}></div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="w-full space-y-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className={`h-4 w-1/4 ${getSkeletonClasses()}`}></div>
            <div className={`h-12 w-full rounded-xl ${getSkeletonClasses()}`}></div>
          </div>
        ))}
        <div className="pt-4 flex justify-end gap-3">
          <div className={`h-12 w-24 rounded-xl ${getSkeletonClasses()}`}></div>
          <div className={`h-12 w-32 rounded-xl ${getSkeletonClasses()}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-4 w-full ${getSkeletonClasses()}`}></div>
  );
};
