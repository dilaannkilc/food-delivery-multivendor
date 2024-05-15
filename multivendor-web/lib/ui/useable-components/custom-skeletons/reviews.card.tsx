import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const ReviewSkeleton = () => {
  return (
    <div className="p-4">
      {}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border p-4 rounded-md shadow-sm">
        <div className="mb-4 md:mb-0">
          {}
          <Skeleton width="5rem" height="3rem" className="mb-2" />
          {}
          <Skeleton width="4rem" height="1.5rem" className="mb-2" />
          {}
          <Skeleton width="8rem" height="1.5rem" />
        </div>
        
        {}
        <div className="w-full md:w-3/5">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center mb-3">
              <Skeleton width="2rem" height="1.5rem" className="mr-2" />
              <Skeleton width="100%" height="0.75rem" />
            </div>
          ))}
        </div>
      </div>
      
      {}
      <div className="space-y-6">
        {[1, 2].map((item) => (
          <div key={item} className="border p-4 rounded-md shadow-sm">
            {}
            <Skeleton width="8rem" height="1.5rem" className="mb-2" />
            {}
            <Skeleton width="12rem" height="1rem" className="mb-2" />
            {}
            <Skeleton width="100%" height="4rem" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSkeleton;