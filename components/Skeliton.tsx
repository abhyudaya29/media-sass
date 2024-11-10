import React from 'react';

const Skeleton = () => {
  return (
    <div className="flex w-52 flex-col gap-4">
      <div className="skeleton h-32 w-full"></div>
      <div className="skeleton h-4 w-28"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
    </div>
  );
};

const SkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </div>
  );
};

export default SkeletonGrid;
