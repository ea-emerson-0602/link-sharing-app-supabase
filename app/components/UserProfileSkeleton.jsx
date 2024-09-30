import React from 'react';

const UserProfileSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primaryBg text-secondaryText animate-pulse">
      <div className="md:p-8 p-5 bg-white shadow-lg rounded-lg w-full">
        <div className="h-8 bg-secondaryBg rounded md:w-1/3 w-full  mx-auto pb-6"></div>
        
        <div className="space-y-6 w-full">
          {/* Profile Picture Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-evenly w-full bg-primaryBg rounded-xl md:rounded-2xl lg:rounded-3xl py-6 px-4 md:px-6 lg:px-8">
            <div className="md:flex-1 w-full md:w-0 text-sm pb-4"></div>
            <div className="flex-none md:w-1/3 w-4/5 h-64 bg-secondaryBg rounded-2xl"></div>
            <div className="md:flex-1 md:px-6  w-full md:w-0 text-sm pt-4">
              <div className="h-4 bg-secondaryBg rounded mb-2"></div>
              <div className="h-4 bg-secondaryBg rounded md:w-2/3 w-full"></div>
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6 bg-primaryBg rounded-xl md:rounded-2xl lg:rounded-3xl py-6 px-4 md:px-6 lg:px-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center">
                <div className="md:flex-1 w-full md:w-0 text-sm font-medium h-4 bg-secondaryBg"></div>
                <div className="mt-1 w-full text-sm md:flex-grow-[2] md:w-0 rounded-md md:rounded-[8px] h-12 mt-2 bg-secondaryBg md:ml-4"></div>
              </div>
            ))}
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default UserProfileSkeleton;