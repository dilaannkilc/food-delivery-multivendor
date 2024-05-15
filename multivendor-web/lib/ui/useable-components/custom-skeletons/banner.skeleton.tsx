import React from 'react';

export default function DiscoveryBannerSkeleton() {
  return (
    <div className="discovery-carousel-skeleton animate-pulse">
      <div className="flex space-x-4 overflow-hidden">
        {[...Array(2)].map((_, index) => (
          <div 
            key={index} 
            className="carousel-item md:mr-[12px] relative w-[890px] h-[300px]"
          >
            {}
            <div className="absolute inset-0 bg-gray-200 rounded-xl opacity-70"></div>
            
            {}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              {}
              <div className="bg-gray-300 h-8 w-3/4 mb-2 rounded"></div>
              
              {}
              <div className="bg-gray-400 h-4 w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}