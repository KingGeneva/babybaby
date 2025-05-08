
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full h-[600px] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-babybaby-cosmic mb-4"></div>
        <p className="text-gray-600">Chargement de la visionneuse...</p>
      </div>
    </div>
  );
};

export default LoadingState;
