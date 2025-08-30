import React from 'react';

interface ChartSkeletonProps {
  height?: number;
}

export default function ChartSkeleton({ height = 300 }: ChartSkeletonProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse"
      style={{ height: height }}
    >
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-2/3 bg-gray-200 rounded"></div>
    </div>
  );
}
