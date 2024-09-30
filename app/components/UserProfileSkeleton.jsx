import React from 'react';

const UserProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-center bg-primaryBg text-secondaryText animate-pulse">
      <div className="lg:p-8 p-5 bg-white shadow-lg rounded-lg w-full">
        <div className="pb-6">
          <div className="h-8 bg-secondaryBg rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-secondaryBg rounded w-1/2 mt-4"></div>
        </div>
        
        <div className="space-y-6 w-full">
          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-evenly w-full bg-primaryBg rounded-xl md:rounded-2xl lg:rounded-3xl py-6 px-4 md:px-6 lg:px-8">
            <div className="md:flex-1 md:mr-6  w-full md:w-0 h-4 bg-secondaryBg rounded mb-4 md:mb-0"></div>
            <div className="flex-none w-4/5 md:w-1/3 h-48 md:h-64 bg-secondaryBg rounded-lg md:rounded-xl lg:rounded-2xl"></div>
            <div className="md:flex-1 md:px-6 w-full md:w-0 mt-4 md:mt-0">
              <div className="h-4 bg-secondaryBg rounded mb-2"></div>
              <div className="h-4 bg-secondaryBg rounded w-3/4"></div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6 bg-primaryBg rounded-xl md:rounded-2xl lg:rounded-3xl py-6 px-4 md:px-6 lg:px-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center">
                <div className="md:flex-1 w-full md:w-0 text-sm font-medium h-4 bg-secondaryBg"></div>
                <div className="mt-1 w-full text-sm md:flex-grow-[2] md:w-0 rounded-md md:rounded-[8px] h-12 bg-secondaryBg md:ml-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;