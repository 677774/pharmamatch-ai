import React from 'react';

const Skeleton = ({ className, style }) => (
  <div 
    className={`skeleton ${className}`} 
    style={style}
  />
);

export const ProjectSkeleton = () => (
  <div className="bg-white border border-outline-variant/50 rounded-xl p-5 flex flex-col h-full">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-text" style={{ width: '40%' }} />
      </div>
    </div>
    <div className="mt-2 space-y-4 flex-1">
      <div className="flex flex-col gap-2">
        <Skeleton className="skeleton-text" style={{ width: '80%' }} />
        <Skeleton className="skeleton-text" style={{ width: '60%' }} />
      </div>
      <div className="pt-4 border-t border-outline-variant/30">
        <div className="flex justify-between mb-1.5">
          <Skeleton className="skeleton-text" style={{ width: '30%' }} />
          <Skeleton className="skeleton-text" style={{ width: '15%' }} />
        </div>
        <Skeleton className="h-1.5 rounded-full" />
      </div>
    </div>
  </div>
);

export const LabValidationSkeleton = () => (
  <div className="bg-white border border-outline-variant/50 rounded-xl p-5 mb-4">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <Skeleton className="skeleton-title" style={{ width: '50%' }} />
        <Skeleton className="skeleton-text" style={{ width: '30%' }} />
      </div>
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
